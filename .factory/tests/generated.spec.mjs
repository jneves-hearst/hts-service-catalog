import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";
import { parseFactorySpecFile } from "../factory-spec.mjs";

const generatedRoot = resolve("tests/generated");
const generatedFiles = (existsSync(generatedRoot) ? readdirSync(generatedRoot, { withFileTypes: true }) : [])
  .filter((entry) => entry.isFile() && /^factory-[a-f0-9-]+\.json$/.test(entry.name))
  .map((entry) => resolve(generatedRoot, entry.name))
  .sort();

if (!generatedFiles.length) {
  test("generated acceptance test spec is present", () => {
    throw new Error("No validated factory acceptance test spec was supplied");
  });
}

function locator(page, value) {
  if (value.kind === "role") return page.getByRole(value.role, { name: value.name, ...(value.exact === undefined ? {} : { exact: value.exact }) });
  if (value.kind === "text") return page.getByText(value.value, value.exact === undefined ? {} : { exact: value.exact });
  if (value.kind === "label") return page.getByLabel(value.value, value.exact === undefined ? {} : { exact: value.exact });
  if (value.kind === "placeholder") return page.getByPlaceholder(value.value, value.exact === undefined ? {} : { exact: value.exact });
  if (value.kind === "testId") return page.getByTestId(value.value);
  return page.locator(value.value);
}

function qaUrl(path) {
  const base = process.env.AMPLIFY_QA_URL;
  if (!base) throw new Error("AMPLIFY_QA_URL is required");
  const target = new URL(path, base);
  if (target.origin !== new URL(base).origin) throw new Error("Generated test attempted to leave the configured QA origin");
  return target.toString();
}

async function runStep(page, step, testInfo) {
  if (step.type === "goto") return page.goto(qaUrl(step.path), { waitUntil: "domcontentloaded" });
  if (step.type === "reload") return page.reload({ waitUntil: "domcontentloaded" });
  if (step.type === "click") return locator(page, step.locator).click();
  if (step.type === "fill") return locator(page, step.locator).fill(step.value);
  if (step.type === "press") return locator(page, step.locator).press(step.key);
  if (step.type === "expectVisible") return expect(locator(page, step.locator)).toBeVisible();
  if (step.type === "expectHidden") return expect(locator(page, step.locator)).toBeHidden();
  if (step.type === "expectText") return expect(locator(page, step.locator)).toContainText(step.value);
  if (step.type === "expectAttribute") return expect(locator(page, step.locator)).toHaveAttribute(step.attribute, step.expected);
  if (step.type === "screenshot") return testInfo.attach(step.name, { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
  throw new Error(`Unsupported generated step: ${step.type}`);
}

for (const file of generatedFiles) {
  const spec = parseFactorySpecFile(file);
  test(spec.name, async ({ page }, testInfo) => {
    for (const step of spec.steps) await runStep(page, step, testInfo);
    await testInfo.attach("factory-final-state", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
  });
}
