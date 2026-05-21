const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const deliveryDir = path.join(root, "delivery");
const localesDir = path.join(root, "public", "locales");
const siteUrl = "https://aipregnancycaloriecalculator.online";

const languages = ["es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];

const pages = [
  { prefix: "home", source: "index.html", target: "index.html", slug: "" },
  { prefix: "pricing", source: "pricing/index.html", target: "pricing/index.html", slug: "pricing" },
  { prefix: "about_us", source: "about/index.html", target: "about/index.html", slug: "about" },
  { prefix: "contact_us", source: "contact/index.html", target: "contact/index.html", slug: "contact" },
  {
    prefix: "privacy_policy",
    source: "privacy-policy/index.html",
    target: "privacy-policy/index.html",
    slug: "privacy-policy",
  },
  {
    prefix: "terms_of_service",
    source: "terms-of-service/index.html",
    target: "terms-of-service/index.html",
    slug: "terms-of-service",
  },
  {
    prefix: "refund_policy",
    source: "refund-policy/index.html",
    target: "refund-policy/index.html",
    slug: "refund-policy",
  },
  {
    prefix: "medical_disclaimer",
    source: "medical-disclaimer/index.html",
    target: "medical-disclaimer/index.html",
    slug: "medical-disclaimer",
  },
  {
    prefix: "cookie_policy",
    source: "cookie-policy/index.html",
    target: "cookie-policy/index.html",
    slug: "cookie-policy",
  },
];

const runtimeCopyKeys = [
  ...Array.from({ length: 40 }, (_, index) => `home.${String(index + 48).padStart(4, "0")}`),
  "activity.sedentary",
  "activity.sedentary.desc",
  "activity.light",
  "activity.light.desc",
  "activity.moderate",
  "activity.moderate.desc",
  "activity.high",
  "activity.high.desc",
  "activity.veryHigh",
  "activity.veryHigh.desc",
  "pregnancy.singleton",
  "pregnancy.singleton.desc",
  "pregnancy.multiple",
  "pregnancy.multiple.desc",
  "week.firstTrimester",
  "week.secondTrimester",
  "week.thirdTrimester",
  "week.pregnancyCurve",
  "result.caringPoint",
  "result.guideposts",
  "result.hideNumbers",
  "result.showNumbers",
  "result.dailyCalories",
  "result.basedOn",
  "result.formula",
  "result.weightGain",
  "result.unitReference",
  "result.singletonWeightType",
  "result.twinWeightType",
  "weekly.title",
  "weekly.adds",
  "weekly.futureValue",
  "weekly.fetalNote",
  "weekly.rangeEnd",
  "safety.reminder",
  "safety.disclaimer",
  "exercise.guide",
  "choice.week",
  "choice.pregnancyType",
  "choice.dailyActivity",
  "choice.weekLabel",
  "choice.activityFactor",
  "unit.kcal",
  "unit.kcalPerDay",
  "dropdown.pregnancyWeek.title",
  "dropdown.pregnancyWeek.week1.label",
  "dropdown.pregnancyWeek.week1.desc",
  "dropdown.pregnancyWeek.week2.label",
  "dropdown.pregnancyWeek.week2.desc",
  "dropdown.pregnancyWeek.week3.label",
  "dropdown.pregnancyWeek.week3.desc",
  "dropdown.pregnancyWeek.week4.label",
  "dropdown.pregnancyWeek.week4.desc",
  "dropdown.pregnancyWeek.week5.label",
  "dropdown.pregnancyWeek.week5.desc",
  "dropdown.pregnancyWeek.week6.label",
  "dropdown.pregnancyWeek.week6.desc",
  "dropdown.pregnancyWeek.week7.label",
  "dropdown.pregnancyWeek.week7.desc",
  "dropdown.pregnancyWeek.week8.label",
  "dropdown.pregnancyWeek.week8.desc",
  "dropdown.pregnancyWeek.week9.label",
  "dropdown.pregnancyWeek.week9.desc",
  "dropdown.pregnancyWeek.week10.label",
  "dropdown.pregnancyWeek.week10.desc",
  "dropdown.pregnancyWeek.week11.label",
  "dropdown.pregnancyWeek.week11.desc",
  "dropdown.pregnancyWeek.week12.label",
  "dropdown.pregnancyWeek.week12.desc",
  "dropdown.pregnancyWeek.week13.label",
  "dropdown.pregnancyWeek.week13.desc",
  "dropdown.pregnancyWeek.week14.label",
  "dropdown.pregnancyWeek.week14.desc",
  "dropdown.pregnancyWeek.week15.label",
  "dropdown.pregnancyWeek.week15.desc",
  "dropdown.pregnancyWeek.week16.label",
  "dropdown.pregnancyWeek.week16.desc",
  "dropdown.pregnancyWeek.week17.label",
  "dropdown.pregnancyWeek.week17.desc",
  "dropdown.pregnancyWeek.week18.label",
  "dropdown.pregnancyWeek.week18.desc",
  "dropdown.pregnancyWeek.week19.label",
  "dropdown.pregnancyWeek.week19.desc",
  "dropdown.pregnancyWeek.week20.label",
  "dropdown.pregnancyWeek.week20.desc",
  "dropdown.pregnancyWeek.week21.label",
  "dropdown.pregnancyWeek.week21.desc",
  "dropdown.pregnancyWeek.week22.label",
  "dropdown.pregnancyWeek.week22.desc",
  "dropdown.pregnancyWeek.week23.label",
  "dropdown.pregnancyWeek.week23.desc",
  "dropdown.pregnancyWeek.week24.label",
  "dropdown.pregnancyWeek.week24.desc",
  "dropdown.pregnancyWeek.week25.label",
  "dropdown.pregnancyWeek.week25.desc",
  "dropdown.pregnancyWeek.week26.label",
  "dropdown.pregnancyWeek.week26.desc",
  "dropdown.pregnancyWeek.week27.label",
  "dropdown.pregnancyWeek.week27.desc",
  "dropdown.pregnancyWeek.week28.label",
  "dropdown.pregnancyWeek.week28.desc",
  "dropdown.pregnancyWeek.week29.label",
  "dropdown.pregnancyWeek.week29.desc",
  "dropdown.pregnancyWeek.week30.label",
  "dropdown.pregnancyWeek.week30.desc",
  "dropdown.pregnancyWeek.week31.label",
  "dropdown.pregnancyWeek.week31.desc",
  "dropdown.pregnancyWeek.week32.label",
  "dropdown.pregnancyWeek.week32.desc",
  "dropdown.pregnancyWeek.week33.label",
  "dropdown.pregnancyWeek.week33.desc",
  "dropdown.pregnancyWeek.week34.label",
  "dropdown.pregnancyWeek.week34.desc",
  "dropdown.pregnancyWeek.week35.label",
  "dropdown.pregnancyWeek.week35.desc",
  "dropdown.pregnancyWeek.week36.label",
  "dropdown.pregnancyWeek.week36.desc",
  "dropdown.pregnancyWeek.week37.label",
  "dropdown.pregnancyWeek.week37.desc",
  "dropdown.pregnancyWeek.week38.label",
  "dropdown.pregnancyWeek.week38.desc",
  "dropdown.pregnancyWeek.week39.label",
  "dropdown.pregnancyWeek.week39.desc",
  "dropdown.pregnancyWeek.week40.label",
  "dropdown.pregnancyWeek.week40.desc",
  "dropdown.pregnancyWeek.week41.label",
  "dropdown.pregnancyWeek.week41.desc",
  "dropdown.pregnancyWeek.week42.label",
  "dropdown.pregnancyWeek.week42.desc",
  "dropdown.pregnancyType.title",
  "dropdown.pregnancyType.singleton.label",
  "dropdown.pregnancyType.singleton.desc",
  "dropdown.pregnancyType.multiple.label",
  "dropdown.pregnancyType.multiple.desc",
  "dropdown.dailyActivity.title",
  "dropdown.dailyActivity.sedentary.label",
  "dropdown.dailyActivity.sedentary.desc",
  "dropdown.dailyActivity.light.label",
  "dropdown.dailyActivity.light.desc",
  "dropdown.dailyActivity.moderate.label",
  "dropdown.dailyActivity.moderate.desc",
  "dropdown.dailyActivity.high.label",
  "dropdown.dailyActivity.high.desc",
  "dropdown.dailyActivity.veryHigh.label",
  "dropdown.dailyActivity.veryHigh.desc",
  "ai.dietTitle",
  "ai.exerciseTitle",
  "ai.tipsTitle",
  "ai.languageInstruction",
  "ai.disclaimer",
  "mealPlan.title",
  "mealPlan.summary",
  "mealPlan.keyNutrients",
  "mealPlan.cookingTime",
  "mealPlan.ingredients",
  "mealPlan.steps",
  "mealPlan.pregnancySafeNote",
  "mealPlan.replaceButton",
  "mealPlan.noneSelected",
  "mealPlan.proteinAbout",
  "calculator.calculating",
  "qa.usingContext",
  "qa.answered",
  "qa.fallback",
  "fetal.week1_4",
  "fetal.week5_8",
  "fetal.week9_13",
  "fetal.week14_17",
  "fetal.week18_22",
  "fetal.week23_27",
  "fetal.week28_31",
  "fetal.week32_35",
  "fetal.week36_40",
  "fetal.week41_42",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceAllLiteral(input, from, to) {
  if (!from || from === to) return input;
  return input.replace(new RegExp(escapeRegExp(from), "g"), to);
}

function canonicalFor(lang, slug) {
  return `${siteUrl}/${lang}${slug ? `/${slug}` : ""}`;
}

function splitScripts(html) {
  return html.split(/(<script\b[\s\S]*?<\/script>)/gi);
}

function applyTranslationsOutsideScripts(html, english, target, prefix) {
  const keys = Object.keys(english)
    .filter((key) => key.startsWith(`${prefix}.`) || (prefix === "home" && key.startsWith("phrase.")))
    .filter((key) => String(english[key]).trim().length > 2)
    .sort((a, b) => String(english[b]).length - String(english[a]).length);

  return splitScripts(html)
    .map((part) => {
      if (/^<script\b/i.test(part)) return part;
      return part
        .split(/(<[^>]+>)/g)
        .map((chunk) => {
          if (chunk.startsWith("<")) return chunk;
          let output = chunk;
          const tokens = [];
          for (const key of keys) {
            const source = english[key];
            const translated = target[key];
            if (typeof source !== "string" || typeof translated !== "string") continue;
            const token = `__LOCALIZE_TOKEN_${tokens.length}__`;
            tokens.push({ token, translated });
            output = replaceAllLiteral(output, source, token);
            output = replaceAllLiteral(output, escapeHtml(source), token);
          }
          for (const { token, translated } of tokens) {
            output = replaceAllLiteral(output, token, translated);
            output = replaceAllLiteral(output, escapeHtml(token), escapeHtml(translated));
          }
          return output;
        })
        .join("");
    })
    .join("");
}

function localizeInternalLinks(html, lang) {
  const linkPairs = [
    [`${siteUrl}/pricing.html`, `${siteUrl}/${lang}/pricing`],
    [`${siteUrl}/about-us.html`, `${siteUrl}/${lang}/about`],
    [`${siteUrl}/contact-us.html`, `${siteUrl}/${lang}/contact`],
    [`${siteUrl}/medical-disclaimer.html`, `${siteUrl}/${lang}/medical-disclaimer`],
    [`${siteUrl}/privacy-policy.html`, `${siteUrl}/${lang}/privacy-policy`],
    [`${siteUrl}/terms-of-service.html`, `${siteUrl}/${lang}/terms-of-service`],
    [`${siteUrl}/cookie-policy.html`, `${siteUrl}/${lang}/cookie-policy`],
    [`${siteUrl}/refund-policy`, `${siteUrl}/${lang}/refund-policy`],
    [`${siteUrl}/pricing`, `${siteUrl}/${lang}/pricing`],
    [`${siteUrl}/about`, `${siteUrl}/${lang}/about`],
    [`${siteUrl}/contact`, `${siteUrl}/${lang}/contact`],
  ];

  return linkPairs.reduce((next, [from, to]) => {
    return next.replace(new RegExp(`href="${escapeRegExp(from)}"`, "g"), `href="${to}"`);
  }, html);
}

function rewriteHreflangCluster(html, lang, slug) {
  const alternateLinks = ["en", ...languages].map((code) => {
    const href =
      code === "en"
        ? `${siteUrl}${slug ? `/${slug}` : ""}`
        : `${siteUrl}/${code}${slug ? `/${slug}` : ""}`;
    return `<link rel="alternate" hreflang="${code}" href="${href}">`;
  });
  const xDefault = `<link rel="alternate" hreflang="x-default" href="${siteUrl}${slug ? `/${slug}` : ""}">`;
  const block = [
    "<!-- Multilingual SEO: Google hreflang cluster. Keep every language reciprocal and absolute. -->",
    ...alternateLinks,
    xDefault,
  ].join("\n  ");

  const pattern = /<!-- Multilingual SEO: Google hreflang cluster\. Keep every language reciprocal and absolute\. -->[\s\S]*?<link rel="alternate" hreflang="x-default" href="[^"]+">/;
  if (!pattern.test(html)) return html;
  return html.replace(pattern, block);
}

function setLanguageSeo(html, lang, page) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  let output = html.replace(/<html\s+lang="[^"]+"\s+dir="[^"]+"/, `<html lang="${lang}" dir="${dir}"`);
  output = output.replace(
    /<link rel="canonical" href="[^"]+">/,
    `<link rel="canonical" href="${canonicalFor(lang, page.slug)}">`,
  );
  output = output.replace(/"inLanguage":\s*"en-US"/g, `"inLanguage": "${lang}"`);
  return output;
}

function setHeadMeta(html, target, prefix) {
  const title = target[`${prefix}.0001`];
  const description = target[`${prefix}.0002`];
  let output = html;
  if (typeof title === "string") {
    output = output.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
    output = output.replace(
      /<meta property="og:title" content="[^"]*">/g,
      `<meta property="og:title" content="${escapeHtml(title)}">`,
    );
    output = output.replace(
      /<meta name="twitter:title" content="[^"]*">/g,
      `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    );
  }
  if (typeof description === "string") {
    output = output.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${escapeHtml(description)}">`,
    );
    output = output.replace(
      /<meta property="og:description" content="[^"]*">/g,
      `<meta property="og:description" content="${escapeHtml(description)}">`,
    );
    output = output.replace(
      /<meta name="twitter:description" content="[^"]*">/g,
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    );
  }
  return output;
}

function injectRuntimeLanguageCopy(html, lang, target) {
  const blockMatch = html.match(new RegExp(`${lang}: \\{[\\s\\S]*?\\n\\s*\\}`));
  const existingBlock = blockMatch ? blockMatch[0] : "";
  const additions = {};
  for (const key of runtimeCopyKeys) {
    if (typeof target[key] === "string" && !existingBlock.includes(`"${key}"`)) additions[key] = target[key];
  }
  for (const [key, value] of Object.entries(target)) {
    if (key.startsWith("phrase.") && typeof value === "string" && !existingBlock.includes(`"${key}"`)) additions[key] = value;
  }
  if (!Object.keys(additions).length) return html;
  const serialized = JSON.stringify(additions, null, 8)
    .replace(/^{\n/, "")
    .replace(/\n}$/, "");
  const pattern = new RegExp(`(${lang}: \\{[\\s\\S]*?)(\\n\\s*\\})`);
  if (!pattern.test(html)) return html;
  return html.replace(pattern, (match, before, after) => {
    const needsComma = /,\s*$/.test(before.trim()) ? "" : ",";
    return `${before}${needsComma}\n        ${serialized}${after}`;
  });
}

const english = readJson(path.join(localesDir, "en", "common.json"));

const homeSourcePath = path.join(deliveryDir, "index.html");
let homeSourceHtml = fs.readFileSync(homeSourcePath, "utf8");
for (const lang of languages) {
  const target = readJson(path.join(localesDir, lang, "common.json"));
  homeSourceHtml = injectRuntimeLanguageCopy(homeSourceHtml, lang, target);
}
fs.writeFileSync(homeSourcePath, homeSourceHtml, "utf8");

let generated = 0;
for (const lang of languages) {
  const target = readJson(path.join(localesDir, lang, "common.json"));
  for (const page of pages) {
    const sourcePath = path.join(deliveryDir, page.source);
    const targetPath = path.join(deliveryDir, lang, page.target);
    let html = fs.readFileSync(sourcePath, "utf8");

    html = setLanguageSeo(html, lang, page);
    html = applyTranslationsOutsideScripts(html, english, target, page.prefix);
    html = setHeadMeta(html, target, page.prefix);
    if (page.prefix === "home") html = injectRuntimeLanguageCopy(html, lang, target);
    html = localizeInternalLinks(html, lang);
    html = rewriteHreflangCluster(html, lang, page.slug);

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, html, "utf8");
    generated += 1;
  }
}

console.log(`Localized ${generated} delivery pages from public/locales.`);
