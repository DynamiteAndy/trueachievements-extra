import * as regex from './regex';

describe('regex', () => {
  describe('achievementPage', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: true },
      { case: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.achievementPage(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('achievementPages', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: true },
      { case: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.achievementsPage(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('staffEditWalkthroughPage', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.staffEditWalkthroughPage(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('staffManageWalkthroughPage', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.staffManageWalkthroughPage(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('staffWalkthroughPage', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.staffWalkthroughPage(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('staffWalkthroughPreviewPage', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.staffWalkthroughPreviewPage(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('staffWalkthroughPagePreviewPage', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.staffWalkthroughPagePreviewPage(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('today', () => {
    const testCases = [
      { case: 'today', expected: true },
      { case: 'Today', expected: true },
      { case: 'today2', expected: false },
      { case: 'Today2', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.today(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('yesterday', () => {
    const testCases = [
      { case: 'yesterday', expected: true },
      { case: 'Yesterday', expected: true },
      { case: 'yesterday2', expected: false },
      { case: 'Yesterday2', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.yesterday(test.case)).toEqual(test.expected);
      });
    });
  });
});
