const languages = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar', 'ja', 'ko'];

function localizedPath(lang, page = '') {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  return `${prefix}${page ? `/${page}` : ''}` || '/';
}

function normalizePath(path) {
  return path === '/' ? '/' : path.replace(/\/+$/, '');
}

function chooseOption(choiceName, optionText, optionValue = '') {
  cy.get(`[data-open-choice="${choiceName}"]`).click();
  cy.get('#choiceList').should('be.visible');
  if (optionValue) {
    cy.get(`#choiceList button[data-choice-value="${optionValue}"]`).click();
    return;
  }
  cy.contains('#choiceList button', optionText).click();
}

function clickLocalizedNav(lang, navPath, page) {
  const path = localizedPath(lang, page);
  cy.get(`[data-nav-path="${navPath}"]`).first().invoke('attr', 'href', path).click();
  cy.location('pathname').should('eq', path);
  cy.get('body').invoke('text').should('not.match', /404|not found/i);
}

languages.forEach(lang => {
  describe(`完整用户流程测试 - ${lang}`, () => {
    beforeEach(() => {
      cy.visit(localizedPath(lang));
    });

    it('首页加载正常，所有元素显示正确', () => {
      cy.get('h1').should('be.visible');
      cy.get('#calculateButton').should('be.visible');
      cy.get('a[href*="pricing"]').should('not.be.visible');
      cy.get('[data-language-switcher][data-location="desktop"]').should('be.visible');
      cy.get('html').should('have.attr', 'dir', lang === 'ar' ? 'rtl' : 'ltr');
      cy.percySnapshot(`首页 - ${lang}`);
    });

    it('计算器功能正常工作', () => {
      cy.get('#calculateButton').should('be.visible');
      cy.get('#calculator').scrollIntoView();

      cy.get('#metricUnitButton').click();
      cy.get('#ageInput').clear().type('28');
      cy.get('#heightInput').clear().type('165');
      cy.get('#weightInput').clear().type('65');
      chooseOption('week', 'Week 24', '24');
      chooseOption('pregnancyType', 'Singleton', 'singleton');
      chooseOption('activity', 'Moderate activity', 'moderate');

      cy.get('#calculateButton').click();

      cy.get('#calorieOutput', { timeout: 60000 }).should('be.visible').and('not.contain.text', '--');
      cy.get('#formulaOutput').should('be.visible').invoke('text').should('match', /kcal|ккал|cal|s سعرة|سعرة|カロリー|칼로리/i);
      cy.get('#weightGainOutput').should('be.visible').invoke('text').should('match', /BMI|IMC|ИМТ|مؤشر كتلة الجسم|体重|체중/i);
      cy.percySnapshot(`计算器结果页 - ${lang}`);
    });

    it('导航到所有页面正常', () => {
      cy.visit(localizedPath(lang));
      clickLocalizedNav(lang, '/about-us.html', 'about');

      cy.visit(localizedPath(lang));
      clickLocalizedNav(lang, '/contact-us.html', 'contact');

      cy.visit(localizedPath(lang, 'pricing'));
      cy.location('pathname').then((pathname) => {
        expect(normalizePath(pathname)).to.eq(normalizePath(localizedPath(lang)));
      });
    });

    it('语言切换功能正常', () => {
      cy.get('[data-language-switcher][data-location="desktop"] .language-switcher-button').first().click();
      cy.get('[data-language-switcher][data-location="desktop"] [data-language-option="es"]').first().click();
      cy.location('pathname').should('eq', '/es');
      cy.get('h1').should('contain.text', 'Calculadora');
    });
  });
});
