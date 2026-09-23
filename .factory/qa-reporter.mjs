import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

export default class FactoryReporter {
  onBegin(_config, suite) { this.suite = suite; }
  onEnd(result) {
    if (!this.suite.allTests().some((test) => test.results.length)) return;
    const root = resolve("qa-evidence");
    mkdirSync(join(root, "screenshots"), { recursive: true });
    const tests = this.suite.allTests().map((test) => {
      const last = test.results.at(-1);
      const screenshots = [];
      for (const attachment of last?.attachments ?? []) {
        if (attachment.contentType !== "image/png") continue;
        const bytes = attachment.body ?? (attachment.path ? readFileSync(attachment.path) : null);
        if (!bytes) continue;
        const sha = createHash("sha256").update(bytes).digest("hex");
        const name = `screenshots/${sha}.png`;
        writeFileSync(join(root, name), bytes);
        screenshots.push(name);
      }
      return { name: test.titlePath().join(" / "), status: last?.status ?? "skipped", screenshots };
    });
    writeFileSync(join(root, "manifest.json"), JSON.stringify({
      version: 1,
      jobId: process.env.FACTORY_JOB_ID,
      attempt: Number(process.env.FACTORY_ATTEMPT),
      sha: process.env.CANDIDATE_SHA,
      runId: process.env.GITHUB_RUN_ID,
      environmentUrl: process.env.AMPLIFY_QA_URL,
      status: result.status,
      tests,
    }, null, 2));
    if (!tests.length || tests.some((test) => test.status !== "passed" || !test.screenshots.length)) return { status: "failed" };
  }
}
