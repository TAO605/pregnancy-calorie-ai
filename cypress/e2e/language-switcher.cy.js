const languages = [
  { code: "en", path: "/", dir: "ltr" },
  { code: "es", path: "/es", dir: "ltr" },
  { code: "fr", path: "/fr", dir: "ltr" },
  { code: "de", path: "/de", dir: "ltr" },
  { code: "pt", path: "/pt", dir: "ltr" },
  { code: "it", path: "/it", dir: "ltr" },
  { code: "ru", path: "/ru", dir: "ltr" },
  { code: "ar", path: "/ar", dir: "rtl" },
  { code: "ja", path: "/ja", dir: "ltr" },
  { code: "ko", path: "/ko", dir: "ltr" }
];

describe("language switcher localized routing", () => {
  languages.forEach((language) => {
    it(`keeps ${language.code} layout direction and language links valid`, () => {
      cy.visit(language.path);
      cy.get("html").should("have.attr", "dir", language.dir);
      cy.get("[data-language-switcher]").first().within(() => {
        cy.get("[data-language-option]").should("have.length", languages.length);
        languages.forEach((targetLanguage) => {
          const expectedHref = targetLanguage.code === "en" ? "/" : `/${targetLanguage.code}`;
          cy.get(`[data-language-option="${targetLanguage.code}"]`)
            .should("have.attr", "hreflang", targetLanguage.code)
            .and("have.attr", "href")
            .then((href) => {
              expect(href).to.match(new RegExp(`${expectedHref.replace("/", "\\/")}$`));
            });
        });
      });
    });
  });

  ["es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"].forEach((code) => {
    it(`keeps ${code} users on localized non-paid routes and redirects paid routes`, () => {
      cy.visit(`/${code}`);
      cy.get(`a[href$="/${code}/pricing"]`).should("not.be.visible");
      cy.get(`a[href$="/${code}/about"]`).should("have.length.greaterThan", 0);
      cy.get(`a[href$="/${code}/contact"]`).should("have.length.greaterThan", 0);

      cy.visit(`/${code}/pricing`);
      cy.location("pathname").should("eq", `/${code}/`);

      cy.visit(`/${code}/contact`);
      cy.get("html").should("have.attr", "dir", code === "ar" ? "rtl" : "ltr");
      cy.contains("support@aipregnancycaloriecalculator.online").should("be.visible");
    });
  });
});

describe("language switch stale AI cleanup", () => {
  function calculateOnce() {
    cy.get("#calculator").scrollIntoView();
    cy.get("#metricUnitButton").click();
    cy.get("#ageInput").clear().type("28");
    cy.get("#heightInput").clear().type("165");
    cy.get("#weightInput").clear().type("65");
    cy.get('[data-open-choice="week"]').click();
    cy.get('#choiceList button[data-choice-value="24"]').click();
    cy.get('[data-open-choice="pregnancyType"]').click();
    cy.get('#choiceList button[data-choice-value="singleton"]').click();
    cy.get('[data-open-choice="activity"]').click();
    cy.get('#choiceList button[data-choice-value="moderate"]').click();
    cy.get("#calculateButton").click();
    cy.get("#aiCards .ai-card", { timeout: 60000 }).should("be.visible");
  }

  function switchLanguage(code) {
    cy.get('[data-language-switcher][data-location="desktop"] .language-switcher-button')
      .first()
      .click();
    cy.get(`[data-language-switcher][data-location="desktop"] [data-language-option="${code}"]`)
      .first()
      .click();
  }

  it("clears generated AI and QA content after switching to French without another AI request", () => {
    let aiRequests = 0;
    let beforeSwitch = 0;
    cy.intercept("POST", "/api/pregnancy-guidance", (req) => {
      aiRequests += 1;
      req.continue();
    });

    cy.visit("/");
    calculateOnce();
    cy.get("#aiCards").should("contain.text", "Personalized");
    cy.then(() => {
      beforeSwitch = aiRequests;
    });
    switchLanguage("fr");
    cy.get(".language-switched-notice")
      .should("be.visible")
      .and("contain.text", "La langue a été changée");
    cy.get("#nutritionQaAnswer").should("contain.text", "La langue a été changée");
    cy.get("#aiCards").should("not.contain.text", "Personalized Daily Diet Plan");
    cy.then(() => {
      expect(aiRequests).to.eq(beforeSwitch);
    });
  });

  it("keeps Arabic RTL input layout and clears generated AI content after language switch", () => {
    cy.visit("/");
    calculateOnce();
    switchLanguage("ar");

    cy.location("pathname").should("eq", "/ar");
    cy.get("html").should("have.attr", "dir", "rtl");
    cy.get(".language-switched-notice")
      .should("be.visible")
      .and("contain.text", "تم تبديل اللغة");
  });

  it("keeps Arabic RTL input layout editable on the calculator input screen", () => {
    cy.visit("/ar#calculator");
    cy.get("html").should("have.attr", "dir", "rtl");
    cy.get("#heightInput").clear().type("166").should("have.value", "166");
    cy.get("#weightInput").clear().type("66").should("have.value", "66");
    cy.get("#heightConversionHint").should("be.visible");
    cy.get("#weightConversionHint").should("be.visible");
  });
});
