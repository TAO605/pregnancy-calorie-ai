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
console.log(`Quality gate report: ${reportPath}`);

if (report.status !== "passed") {
  process.exit(1);
}
