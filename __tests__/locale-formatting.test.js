const rules = require('../src/lib/i18n/locale-formatting.config.json');

function normalizeSpaces(value) {
  return value.replace(/[\u00a0\u202f]/g, ' ');
}

function formatNumber(value, lang) {
  const fixed = value.toFixed(2);
  const [integerPart, decimalPart] = fixed.split('.');
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, rules[lang].groupSeparator);

  return normalizeSpaces(`${groupedInteger}${rules[lang].decimalSeparator}${decimalPart}`);
}

function formatDate(date, lang) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (rules[lang].dateFormat) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'YYYY/MM/DD':
      return `${year}/${month}/${day}`;
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`;
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`;
  }
}

test('所有语言的数字格式化正确', () => {
  const expectedNumbers = {
    en: '1,234.56',
    es: '1.234,56',
    fr: '1 234,56',
    de: '1.234,56',
    pt: '1.234,56',
    it: '1.234,56',
    ru: '1 234,56',
    ar: '1,234.56',
    ja: '1,234.56',
    ko: '1,234.56',
  };

  const expectedDates = {
    en: '05/19/2026',
    es: '19/05/2026',
    fr: '19/05/2026',
    de: '19.05.2026',
    pt: '19/05/2026',
    it: '19/05/2026',
    ru: '19.05.2026',
    ar: '19/05/2026',
    ja: '2026/05/19',
    ko: '2026.05.19',
  };

  Object.keys(expectedNumbers).forEach(lang => {
    expect(formatNumber(1234.56, lang)).toBe(expectedNumbers[lang]);
    expect(formatDate(new Date(2026, 4, 19), lang)).toBe(expectedDates[lang]);

    if (lang === 'en') {
      expect(rules[lang].unitSystem).toBe('both');
      expect(rules[lang].heightUnit).toBe('in');
      expect(rules[lang].weightUnit).toBe('lb');
    } else {
      expect(rules[lang].unitSystem).toBe('metric');
      expect(rules[lang].heightUnit).toBe('cm');
      expect(rules[lang].weightUnit).toBe('kg');
    }
  });
});
