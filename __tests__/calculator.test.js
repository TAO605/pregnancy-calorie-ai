import { calculatePregnancyCalories } from '../src/lib/calculator/calculate-pregnancy-calories';
import { calculatorInputSchema, normalizeCalculatorInput } from '../src/lib/validations/calculator-input';

function calculateCalories(testData, locale = 'en') {
  return calculatePregnancyCalories(
    normalizeCalculatorInput({
      age: testData.age,
      height: testData.height,
      heightUnit: 'cm',
      prePregnancyWeight: testData.weight,
      currentWeight: testData.weight,
      weightUnit: 'kg',
      gestationalWeek: testData.week,
      pregnancyType: testData.type,
      activityLevel: testData.activity,
      countryCode: 'US',
      locale,
    }),
  );
}

test('所有语言版本计算器计算结果完全相同', () => {
  const testData = {
    age: 28,
    height: 165,
    weight: 65,
    week: 24,
    type: 'singleton',
    activity: 'moderate'
  };

  const expectedResult = calculateCalories(testData);

  const languages = ['es', 'fr', 'de', 'pt', 'it', 'ru', 'ar', 'ja', 'ko'];

  languages.forEach(lang => {
    const result = calculateCalories(testData, lang);
    expect(result).toEqual(expectedResult);
  });
});

test('所有语言版本表单验证正常', () => {
  const en = require('../public/locales/en/common.json');
  const languages = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar', 'ja', 'ko'];
  const localizedFieldLabelKeys = ['home.0031', 'home.0032', 'home.0035', 'home.0038', 'home.0042'];

  const expectedEmptyIssuePaths = [
    'activityLevel',
    'age',
    'countryCode',
    'gestationalWeek',
    'height',
    'heightUnit',
    'prePregnancyWeight',
    'pregnancyType',
    'weightUnit',
  ];

  const expectedInvalidIssuePaths = [
    'age',
    'countryCode',
    'currentWeight',
    'gestationalWeek',
    'height',
    'prePregnancyWeight',
  ];

  languages.forEach(lang => {
    const emptyResult = calculatorInputSchema.safeParse({ locale: lang });
    expect(emptyResult.success).toBe(false);
    expect(emptyResult.error.issues.map(issue => issue.path.join('.')).sort()).toEqual(expectedEmptyIssuePaths);

    const invalidResult = calculatorInputSchema.safeParse({
      age: 10,
      height: 0,
      heightUnit: 'cm',
      prePregnancyWeight: 0,
      currentWeight: -1,
      weightUnit: 'kg',
      gestationalWeek: 43,
      activityLevel: 'moderate',
      pregnancyType: 'singleton',
      countryCode: 'U',
      locale: lang,
    });

    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error.issues.map(issue => issue.path.join('.')).sort()).toEqual(expectedInvalidIssuePaths);

    const langFile = require(`../public/locales/${lang}/common.json`);
    localizedFieldLabelKeys.forEach(key => {
      expect(typeof langFile[key]).toBe('string');
      expect(langFile[key].trim().length).toBeGreaterThan(0);
      expect(langFile[key]).not.toMatch(/\uFFFD/);
      if (lang !== 'en') {
        expect(langFile[key]).not.toBe(en[key]);
      }
    });
  });
});
