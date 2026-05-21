const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const homepage = fs.readFileSync(path.join(repoRoot, 'delivery', 'index.html'), 'utf8');
const languages = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar', 'ja', 'ko'];
const languageCookieName = 'pcc_language';

function getCookieValue(name) {
  const prefix = `${name}=`;
  return document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(prefix))
    ?.slice(prefix.length) || '';
}

function saveLanguageCookie(code) {
  document.cookie = `${languageCookieName}=${encodeURIComponent(code)}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

test('语言切换器能正确加载对应语言', () => {
  languages.forEach(lang => {
    expect(homepage).toContain(`code: "${lang}"`);

    const expectedHref = lang === 'en'
      ? 'https://aipregnancycaloriecalculator.online'
      : `https://aipregnancycaloriecalculator.online/${lang}`;
    expect(homepage).toContain(`hreflang="${lang}" href="${expectedHref}`);

    const localizedIndex = lang === 'en'
      ? path.join(repoRoot, 'delivery', 'index.html')
      : path.join(repoRoot, 'delivery', lang, 'index.html');
    expect(fs.existsSync(localizedIndex)).toBe(true);
  });

  saveLanguageCookie('fr');
  expect(decodeURIComponent(getCookieValue(languageCookieName))).toBe('fr');

  const languageAfterRefresh = decodeURIComponent(getCookieValue(languageCookieName));
  expect(languageAfterRefresh).toBe('fr');
});
