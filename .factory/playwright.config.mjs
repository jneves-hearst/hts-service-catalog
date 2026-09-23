import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  forbidOnly: true,
  retries: 0,
  workers: 1,
  timeout: 60000,
  reporter: [["line"], ["html", { open: "never" }], ["./qa-reporter.mjs"]],
  use: {
    screenshot: "on",
    trace: "off",
    video: "off",
    ...(process.env.AMPLIFY_TEST_STORAGE_STATE
      ? { storageState: process.env.AMPLIFY_TEST_STORAGE_STATE }
      : {}),
  },
});
