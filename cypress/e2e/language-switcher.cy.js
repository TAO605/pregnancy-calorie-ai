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
