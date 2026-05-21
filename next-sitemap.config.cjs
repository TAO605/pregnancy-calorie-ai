const siteUrl = "https://aipregnancycaloriecalculator.online";
const languages = ["en", "es", "fr", "de", "pt", "it", "ru", "ar", "ja", "ko"];
const pages = [
  { path: "", changefreq: "weekly", priority: 1.0 },
  { path: "/pricing", changefreq: "weekly", priority: 0.8 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
];

function localizedPath(language, pagePath) {
  if (language === "en") {
    return pagePath || "/";
  }

  return `/${language}${pagePath}`;
}

function absoluteUrl(language, pagePath) {
  const path = localizedPath(language, pagePath);
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

function alternateRefs(pagePath) {
  return [
    ...languages.map((language) => ({
      hreflang: language,
      href: absoluteUrl(language, pagePath),
      hrefIsAbsolute: true,
    })),
    {
      hreflang: "x-default",
      href: absoluteUrl("en", pagePath),
      hrefIsAbsolute: true,
    },
  ];
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateIndexSitemap: false,
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.8,
  sitemapSize: 5000,
  transform: async () => null,
  additionalPaths: async () => {
    const lastmod = new Date().toISOString();

    return pages.flatMap((page) =>
      languages.map((language) => ({
        loc: localizedPath(language, page.path),
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod,
        alternateRefs: alternateRefs(page.path),
      })),
    );
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
};
