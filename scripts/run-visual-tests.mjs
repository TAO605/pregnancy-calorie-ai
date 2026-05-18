import { spawn } from "node:child_process";

const hasPercyToken = Boolean(process.env.PERCY_TOKEN);

if (process.env.CI && !hasPercyToken) {
  console.error("PERCY_TOKEN is required in CI for visual regression tests.");
  process.exit(1);
}

const command = hasPercyToken
  ? "percy exec -- cypress run --spec cypress/e2e/visual.cy.js"
  : "cypress run --spec cypress/e2e/visual.cy.js --env PERCY_ENABLED=false";

const child = spawn(command, {
  shell: true,
  stdio: "inherit",
  env: process.env
});

child.on("close", (code) => process.exit(code || 0));
