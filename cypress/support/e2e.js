import "@percy/cypress";

beforeEach(() => {
  cy.on("uncaught:exception", () => false);
  cy.window({ log: false }).then((win) => {
    win.__qaConsoleLogs = [];
  });
  cy.on("window:before:load", (win) => {
    win.__qaConsoleLogs = [];
    ["error", "warn"].forEach((level) => {
      const original = win.console[level];
      win.console[level] = function captureConsoleMessage(...args) {
        win.__qaConsoleLogs.push({
          level,
          message: args.map((arg) => String(arg)).join(" "),
          url: win.location.href
        });
        return original.apply(this, args);
      };
    });
  });
});

afterEach(function writeConsoleReport() {
  const safeTitle = this.currentTest.fullTitle().replace(/[^a-z0-9_-]+/gi, "-").slice(0, 120);
  cy.window({ log: false }).then((win) => {
    const logs = win.__qaConsoleLogs || [];
    cy.task("writeConsoleReport", {
      fileName: `${safeTitle}.json`,
      logs
    });
    const errors = logs.filter((entry) => entry.level === "error");
    expect(errors, "browser console errors").to.deep.equal([]);
  });
});
