import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = path.join(repoRoot, ".qa", "reports");
fs.mkdirSync(reportDir, { recursive: true });

function runStep(name, command, options = {}) {
  return new Promise((resolve) => {
    const startedAt = new Date().toISOString();
    const child = spawn(command, {
      cwd: repoRoot,
      shell: true,
      env: { ...process.env, ...options.env }
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });
    child.on("close", (code) => {
      const endedAt = new Date().toISOString();
      const result = { name, command, status: code === 0 ? "passed" : "failed", exitCode: code, startedAt, endedAt };
      fs.writeFileSync(path.join(reportDir, `${name}.stdout.log`), stdout, "utf8");
      fs.writeFileSync(path.join(reportDir, `${name}.stderr.log`), stderr, "utf8");
      resolve(result);
    });
  });
}

function listFilesSafe(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const output = [];
  const stack = [dirPath];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else output.push(fullPath);
    }
  }
  return output.sort();
}

function suggestionFor(stepName) {
  if (stepName === "unit-integration") {
    return [
      "Check locale JSON key order, placeholder preservation, hreflang/canonical contract, and generated delivery page structure.",
      "If a non-English page fails, regenerate pages with `npm run localize:delivery` after fixing the matching locale value."
    ];
  }
  if (stepName === "e2e") {
    return [
      "Open the failing Cypress screenshot and console report under `.qa/reports/cypress-console`.",
      "Verify the calculator still returns the same result across all languages and language navigation keeps the selected locale."
    ];
  }
  if (stepName === "visual") {
    return [
      "Review `cypress/screenshots/visual.cy.js` for layout drift against the English baseline.",
      "Look for text overflow, RTL mirroring issues, hidden buttons, or unexpected page height changes."
    ];
  }
  return ["Inspect the step logs and reproduce locally with the command shown in the report."];
}

function writeMarkdownReport(report, reportPath) {
  const screenshots = listFilesSafe(path.join(repoRoot, "cypress", "screenshots"));
  const consoleReports = listFilesSafe(path.join(reportDir, "cypress-console"));
  const passedSteps = report.steps.filter((step) => step.status === "passed").length;
  const failedSteps = report.steps.filter((step) => step.status === "failed").length;
  const passRate = report.steps.length ? Math.round((passedSteps / report.steps.length) * 100) : 0;
  const unitIntegrationStep = report.steps.find((step) => step.name === "unit-integration");
  const e2eStep = report.steps.find((step) => step.name === "e2e");
  const visualStep = report.steps.find((step) => step.name === "visual");
  const lines = [
    "# Quality Gate Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Overall pass rate: ${passRate}% (${passedSteps}/${report.steps.length} steps passed)`,
    `Failed steps: ${failedSteps}`,
    "",
    "## Unit Test Report",
    "",
    `- Status: ${unitIntegrationStep?.status ?? "not-run"}`,
    `- Command: \`${unitIntegrationStep?.command ?? "npm run test:jest"}\``,
    `- Details: \`${path.join(reportDir, "unit-integration.stdout.log")}\``,
    `- Failures and stack traces: \`${path.join(reportDir, "unit-integration.stderr.log")}\``,
    "",
    "## Integration Test Report",
    "",
    `- Status: ${unitIntegrationStep?.status ?? "not-run"}`,
    "- Coverage: locale JSON integrity, placeholders, language switcher contract, localized delivery route contract, calculator consistency, and locale formatting.",
    `- Details: \`${path.join(reportDir, "unit-integration.stdout.log")}\``,
    "",
    "## E2E Test Report",
    "",
    `- Status: ${e2eStep?.status ?? "not-run"}`,
    `- Command: \`${e2eStep?.command ?? "npm run test:e2e"}\``,
    "- Coverage: homepage load, calculator flow, localized navigation, language switching, and browser console error capture.",
    `- Details: \`${path.join(reportDir, "e2e.stdout.log")}\``,
    `- Failures and stack traces: \`${path.join(reportDir, "e2e.stderr.log")}\``,
    "",
    "## Visual Regression Test Report",
    "",
    `- Status: ${visualStep?.status ?? "not-run"}`,
    `- Command: \`${visualStep?.command ?? "npm run test:visual"}\``,
    "- Coverage: full-page screenshots for every supported homepage language, plus Percy snapshots when `PERCY_TOKEN` is configured.",
    "- Difference analysis: review Percy build output in CI when enabled; local fallback screenshots are listed below.",
    "",
    "## Comprehensive Report",
    "",
    `- Total steps: ${report.steps.length}`,
    `- Passed: ${passedSteps}`,
    `- Failed: ${failedSteps}`,
    `- Deployment decision: ${report.status === "passed" ? "allowed" : "blocked"}`,
    "",
    "## Steps",
    "",
  ];

  for (const step of report.steps) {
    lines.push(`### ${step.name}: ${step.status}`);
    lines.push(`- Command: \`${step.command}\``);
    lines.push(`- Exit code: ${step.exitCode}`);
    lines.push(`- Stdout: \`${path.join(reportDir, `${step.name}.stdout.log`)}\``);
    lines.push(`- Stderr: \`${path.join(reportDir, `${step.name}.stderr.log`)}\``);
    if (step.status === "failed") {
      lines.push("- Suggested fixes:");
      for (const suggestion of suggestionFor(step.name)) {
        lines.push(`  - ${suggestion}`);
      }
    }
    lines.push("");
  }

  lines.push("## Screenshots");
  if (screenshots.length) {
    for (const screenshot of screenshots) lines.push(`- \`${screenshot}\``);
  } else {
    lines.push("- No Cypress screenshots were generated.");
  }
  lines.push("");

  lines.push("## Browser Console Reports");
  if (consoleReports.length) {
    for (const consoleReport of consoleReports) lines.push(`- \`${consoleReport}\``);
  } else {
    lines.push("- No browser console reports were generated.");
  }
  lines.push("");

  lines.push("## Deployment Rule");
  lines.push(report.deploymentGate);
  lines.push("");

  lines.push("## Failure Handling");
  lines.push("- Any failed step exits non-zero and blocks the GitHub required status check.");
  lines.push("- Open the failed step stdout/stderr logs for the test name, error message, and stack trace.");
  lines.push("- Open Cypress screenshots for the failed page state.");
  lines.push("- Open browser console reports for captured `console.error` and `console.warn` messages.");
  lines.push("- Open Percy for visual diffs when `PERCY_TOKEN` is configured; otherwise compare the local screenshot artifacts.");
  lines.push("- Fix the issue, commit again, and let GitHub Actions re-run the gate.");
  lines.push("");

  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
}

const steps = [
  ["unit-integration", "npm run test:jest"],
  ["e2e", "npm run test:e2e"],
  ["visual", "npm run test:visual"]
];

const results = [];
for (const [name, command] of steps) {
  results.push(await runStep(name, command));
}

const deeplLogPath = path.join(repoRoot, "public", "locales", "deepl-api-call-log.json");
const report = {
  generatedAt: new Date().toISOString(),
  status: results.every((step) => step.status === "passed") ? "passed" : "failed",
  steps: results,
  artifacts: {
    reportDir,
    deeplApiCallLog: fs.existsSync(deeplLogPath) ? deeplLogPath : null,
    cypressScreenshots: path.join(repoRoot, "cypress", "screenshots")
  },
  deploymentGate: "Deployments must run `npm run quality:gate` and stop when this report status is failed."
};

const reportPath = path.join(reportDir, "quality-gate-report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
const markdownReportPath = path.join(reportDir, "quality-gate-report.md");
writeMarkdownReport(report, markdownReportPath);
console.log(`Quality gate report: ${reportPath}`);
console.log(`Quality gate markdown report: ${markdownReportPath}`);

if (report.status !== "passed") {
  process.exit(1);
}
