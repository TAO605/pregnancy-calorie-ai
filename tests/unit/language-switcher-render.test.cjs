/**
 * @jest-environment jsdom
 */

const React = require("react");
const { render, screen } = require("@testing-library/react");
require("@testing-library/jest-dom");

const languages = [
  { code: "en", label: "English", href: "/" },
  { code: "es", label: "Español", href: "/es" },
  { code: "fr", label: "Français", href: "/fr" },
  { code: "de", label: "Deutsch", href: "/de" },
  { code: "pt", label: "Português", href: "/pt" },
  { code: "it", label: "Italiano", href: "/it" },
  { code: "ru", label: "Русский", href: "/ru" },
  { code: "ar", label: "العربية", href: "/ar" },
  { code: "ja", label: "日本語", href: "/ja" },
  { code: "ko", label: "한국어", href: "/ko" },
];

function LanguageSwitcherContract({ current = "en" }) {
  return React.createElement(
    "nav",
    { "aria-label": "Language selector" },
    languages.map((language) =>
      React.createElement(
        "a",
        {
          key: language.code,
          href: language.href,
          hrefLang: language.code,
          lang: language.code,
          "aria-current": language.code === current ? "page" : undefined,
        },
        language.label,
      ),
    ),
  );
}

describe("language switcher accessibility render contract", () => {
  test("renders all language names as real links without flags", () => {
    render(React.createElement(LanguageSwitcherContract, { current: "ar" }));

    for (const language of languages) {
      const link = screen.getByRole("link", { name: language.label });
      expect(link).toHaveAttribute("href", language.href);
      expect(link).toHaveAttribute("hreflang", language.code);
      expect(link).toHaveAttribute("lang", language.code);
    }
    expect(screen.getByRole("link", { name: "العربية" })).toHaveAttribute("aria-current", "page");
    expect(document.body.textContent).not.toMatch(/[🇦-🇿]/u);
  });
});
