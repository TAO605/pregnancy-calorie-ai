/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://aipregnancycaloriecalculator.online',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*'],
  alternateRefs: [
    {
      href: 'https://aipregnancycaloriecalculator.online/es',
      hreflang: 'es',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online/fr',
      hreflang: 'fr',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online/de',
      hreflang: 'de',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online/pt',
      hreflang: 'pt',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online/it',
      hreflang: 'it',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online/ru',
      hreflang: 'ru',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online/ar',
      hreflang: 'ar',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online/ja',
      hreflang: 'ja',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online/ko',
      hreflang: 'ko',
    },
    {
      href: 'https://aipregnancycaloriecalculator.online',
      hreflang: 'x-default',
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://aipregnancycaloriecalculator.online/sitemap.xml',
    ],
  },
};
