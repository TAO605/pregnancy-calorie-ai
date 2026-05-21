test('所有语言包包含完全相同的键', () => {
  const en = require('../public/locales/en/common.json');
  const languages = ['es', 'fr', 'de', 'pt', 'it', 'ru', 'ar', 'ja', 'ko'];

  languages.forEach(lang => {
    const langFile = require(`../public/locales/${lang}/common.json`);
    expect(Object.keys(langFile)).toEqual(Object.keys(en));
  });
});

test('所有语言包中的动态变量未被翻译或删除', () => {
  const en = require('../public/locales/en/common.json');
  const languages = ['es', 'fr', 'de', 'pt', 'it', 'ru', 'ar', 'ja', 'ko'];

  const variableRegex = /\{[a-zA-Z0-9_]+\}/g;

  Object.entries(en).forEach(([key, value]) => {
    const variables = value.match(variableRegex) || [];

    languages.forEach(lang => {
      const langValue = require(`../public/locales/${lang}/common.json`)[key];
      const langVariables = langValue.match(variableRegex) || [];
      expect(langVariables).toEqual(variables);
    });
  });
});
