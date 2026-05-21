const languages = [
  { code: "en", path: "/" },
  { code: "es", path: "/es" },
  { code: "fr", path: "/fr" },
  { code: "de", path: "/de" },
  { code: "pt", path: "/pt" },
  { code: "it", path: "/it" },
  { code: "ru", path: "/ru" },
  { code: "ar", path: "/ar" },
  { code: "ja", path: "/ja" },
  { code: "ko", path: "/ko" }
];

describe("Percy visual regression snapshots", () => {
  languages.forEach((language) => {
    it(`captures ${language.code} homepage layout`, () => {
      cy.visit(language.path);
      cy.get("body").should("be.visible");
      cy.get("#calculateButton", { timeout: 20000 }).should("be.visible");

      cy.percySnapshot(`homepage-${language.code}`, {
        widths: [390, 768, 1365],
        minHeight: 900
      });
      cy.screenshot(`homepage-${language.code}`, { capture: "fullPage" });
    });
  });
});
