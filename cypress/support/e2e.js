import "@percy/cypress";

beforeEach(() => {
  cy.on("uncaught:exception", () => false);
});
