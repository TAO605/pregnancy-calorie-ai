const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

const consoleReportDir = path.join(__dirname, ".qa", "reports", "cypress-console");

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://127.0.0.1:4173",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.js",
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    setupNodeEvents(on, config) {
      on("task", {
        writeConsoleReport({ fileName, logs }) {
          fs.mkdirSync(consoleReportDir, { recursive: true });
          fs.writeFileSync(
            path.join(consoleReportDir, fileName),
            JSON.stringify(logs, null, 2) + "\n",
            "utf8",
          );
          return null;
        }
      });
      return config;
    }
  }
});
