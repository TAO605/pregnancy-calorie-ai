const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const homePage = fs.readFileSync(
  path.join(repoRoot, "src", "app", "[locale]", "(marketing)", "page.tsx"),
  "utf8",
);
const localeMeta = fs.readFileSync(
  path.join(repoRoot, "src", "lib", "i18n", "locale-meta.ts"),
  "utf8",
);
const seoMetadata = fs.readFileSync(
  path.join(repoRoot, "src", "lib", "seo", "metadata.ts"),
  "utf8",
);

describe("localized JSON meta wiring", () => {
  test("marketing homepage reads non-English meta keys from locale JSON", () => {
    expect(homePage).toContain('getLocaleJsonMeta(locale, "home")');
    expect(homePage).toContain("localeMeta.title ?? pageCopy.homeMetaTitle");
    expect(homePage).toContain("localeMeta.description ?? pageCopy.homeMetaDescription");
  });

  test("locale meta helper never reads English JSON override keys", () => {
    expect(localeMeta).toContain('if (locale === "en")');
    expect(localeMeta).toContain('`${page}.meta.title`');
    expect(localeMeta).toContain('`${page}.meta.description`');
  });

  test("marketing metadata uses absolute page titles without the root title suffix", () => {
    expect(seoMetadata).toContain("absolute: title");
  });
});
