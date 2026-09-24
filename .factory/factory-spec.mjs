import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_SPEC_BYTES = 30000;
const MAX_STEPS = 50;
const STEP_TYPES = new Set(["goto", "reload", "click", "fill", "press", "expectVisible", "expectHidden", "expectText", "expectAttribute", "screenshot"]);
const LOCATOR_KINDS = new Set(["role", "text", "label", "placeholder", "testId", "css"]);
const ROLE_NAMES = new Set(["button", "link", "heading", "textbox", "checkbox", "radio", "tab", "switch", "combobox", "listbox", "option", "menuitem", "navigation", "img", "dialog", "main", "region"]);
const KEY_NAMES = new Set(["Enter", "Tab", "Shift+Tab", "Escape", "Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "Control+a", "Control+c", "Control+v", "Control+x"]);

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}
function keys(value, allowed, label) {
  for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error(`${label} contains unsupported field ${key}`);
}
function string(value, label, max = 500) {
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) throw new Error(`${label} must be a bounded printable string`);
  return value;
}
function locator(value) {
  const item = object(value, "step.locator");
  keys(item, new Set(["kind", "role", "value", "name", "exact"]), "step.locator");
  if (!LOCATOR_KINDS.has(item.kind)) throw new Error("step.locator.kind is not allowlisted");
  if (item.exact !== undefined && typeof item.exact !== "boolean") throw new Error("step.locator.exact must be boolean");
  if (item.kind === "role") {
    if (!ROLE_NAMES.has(item.role)) throw new Error("step.locator.role is not allowlisted");
    return { kind: "role", role: item.role, name: string(item.name, "step.locator.name", 160), ...(item.exact === undefined ? {} : { exact: item.exact }) };
  }
  return { kind: item.kind, value: string(item.value, "step.locator.value", 300), ...(item.exact === undefined ? {} : { exact: item.exact }) };
}
function path(value) {
  const result = string(value, "step.path", 500);
  if (!result.startsWith("/") || result.startsWith("//") || result.includes("://") || result.includes("\\")) throw new Error("step.path must be a relative path on the configured QA origin");
  return result;
}
function step(value, index) {
  const item = object(value, `steps[${index}]`);
  if (!STEP_TYPES.has(item.type)) throw new Error(`steps[${index}].type is not allowlisted`);
  if (item.type === "goto") {
    keys(item, new Set(["type", "path"]), `steps[${index}]`);
    return { type: item.type, path: path(item.path) };
  }
  if (item.type === "reload") {
    keys(item, new Set(["type"]), `steps[${index}]`);
    return { type: item.type };
  }
  if (item.type === "screenshot") {
    keys(item, new Set(["type", "name"]), `steps[${index}]`);
    const name = string(item.name, `steps[${index}].name`, 80);
    if (!/^[A-Za-z0-9_-]+$/.test(name)) throw new Error(`steps[${index}].name must be a filename-safe label`);
    return { type: item.type, name };
  }
  keys(item, new Set(["type", "locator", "value", "key", "attribute", "expected"]), `steps[${index}]`);
  const result = { type: item.type, locator: locator(item.locator) };
  if (item.type === "fill" || item.type === "expectText") result.value = string(item.value, `steps[${index}].value`);
  if (item.type === "press") {
    if (!KEY_NAMES.has(item.key)) throw new Error(`steps[${index}].key is not allowlisted`);
    result.key = item.key;
  }
  if (item.type === "expectAttribute") {
    result.attribute = string(item.attribute, `steps[${index}].attribute`, 80);
    if (!/^[A-Za-z][A-Za-z0-9_:-]*$/.test(result.attribute)) throw new Error(`steps[${index}].attribute is invalid`);
    result.expected = string(item.expected, `steps[${index}].expected`);
  }
  return result;
}

export function parseFactorySpec(value) {
  const spec = typeof value === "string" ? JSON.parse(value) : value;
  object(spec, "generated test spec");
  keys(spec, new Set(["name", "criteria", "steps"]), "generated test spec");
  const name = string(spec.name, "generated test name", 160);
  if (!Array.isArray(spec.criteria) || spec.criteria.length < 1 || spec.criteria.length > 10) throw new Error("generated test criteria must contain 1–10 items");
  const criteria = spec.criteria.map((item, index) => string(item, `criteria[${index}]`, 500));
  if (!Array.isArray(spec.steps) || spec.steps.length < 1 || spec.steps.length > MAX_STEPS) throw new Error(`generated test steps must contain 1–${MAX_STEPS} items`);
  return { name, criteria, steps: spec.steps.map(step) };
}

export function parseFactorySpecFile(path) {
  const content = readFileSync(path, "utf8");
  if (Buffer.byteLength(content) > MAX_SPEC_BYTES) throw new Error("Generated test spec is oversized");
  return parseFactorySpec(content);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv[2]) {
  parseFactorySpecFile(process.argv[2]);
  console.log(`Validated declarative factory test spec: ${process.argv[2]}`);
}
