const languages = [
  { code: "en", base: "/" },
  { code: "es", base: "/es" },
  { code: "fr", base: "/fr" },
  { code: "de", base: "/de" },
  { code: "pt", base: "/pt" },
  { code: "it", base: "/it" },
  { code: "ru", base: "/ru" },
  { code: "ar", base: "/ar" },
  { code: "ja", base: "/ja" },
  { code: "ko", base: "/ko" }
];

function localizedPath(language, page) {
  if (language.code === "en") return page === "home" ? "/" : `/${page}`;
  return page === "home" ? language.base : `${language.base}/${page}`;
}

function chooseOption(choiceName, optionText) {
  cy.get(`[data-open-choice="${choiceName}"]`).click();
  cy.get("#choiceList").should("be.visible");
  cy.contains("#choiceList button", optionText).click();
}

describe("AI Pregnancy Calorie Calculator full localized flow", () => {
  languages.forEach((language) => {
    it(`loads and calculates correctly in ${language.code}`, () => {
      cy.visit(localizedPath(language, "home"));
      cy.document().then((doc) => {
        expect(doc.querySelectorAll("script").length).to.be.greaterThan(0);
      });

      cy.get("#metricUnitButton").click();
      cy.get("#heightUnitButton").should("contain.text", "cm");
      cy.get("#weightUnitButton").should("contain.text", "kg");
      cy.get("#heightInput").clear().type("165");
      cy.get("#weightInput").clear().type("65");
      chooseOption("week", "Week 24");
      chooseOption("pregnancyType", "Singleton");
      chooseOption("activity", "Moderate activity");
      cy.get("#calculateButton").click();
      cy.get("#calorieOutput", { timeout: 60000 }).should("contain.text", "2,510 kcal");
      cy.contains("Week 24").should("be.visible");
      cy.contains("Moderate").should("be.visible");
    });

    it(`loads core commercial pages in ${language.code}`, () => {
      cy.visit(localizedPath(language, "pricing"));
      cy.contains(/Pricing|Choose Your Plan|Plan/i).should("be.visible");

      cy.visit(localizedPath(language, "about"));
      cy.contains(/About|AI Pregnancy Calorie Calculator/i).should("be.visible");

      cy.visit(localizedPath(language, "contact"));
      cy.contains(/Contact|support@aipregnancycaloriecalculator\.online/i).should("be.visible");
    });
  });
});
