import regex from './regex';

describe('regex', () => {
  describe('achievementUrl', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: true },
      { case: 'https://www.trueachievements.com/a223526/and-were-back-achievement?gamerid=96119', expected: true },
      { case: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.achievements.achievementUrl(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('achievementsUrl', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: true },
      { case: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.game.achievementsUrl(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('staff - walkthrough - all', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.staff.walkthrough.all(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('staff - walkthrough - preview', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: false },
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false },
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757', expected: false },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: false },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.staff.walkthrough.preview(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('editWalkthroughUrl', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.staff.walkthrough.editWalkthroughUrl(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('manageWalkthroughUrl', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.staff.walkthrough.manageWalkthroughUrl(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('manageWalkthroughUrlWithWalkthroughId', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.staff.walkthrough.manageWalkthroughUrlWithWalkthroughId(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('walkthroughPageUrl', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.staff.walkthrough.walkthroughPageUrl(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('walkthroughPreviewUrl', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.staff.walkthrough.walkthroughPreviewUrl(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('walkthroughPagePreviewUrl', () => {
    const testCases = [
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
      { case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: false }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.test.staff.walkthrough.walkthroughPagePreviewUrl(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('today', () => {
    const testCases = [
      { case: 'today', expected: true },
      { case: 'Today', expected: true }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.words.today.test(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('yesterday', () => {
    const testCases = [
      { case: 'yesterday', expected: true },
      { case: 'Yesterday', expected: true }
    ];

    testCases.forEach((test, index) => {
      it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(regex.words.yesterday.test(test.case)).toEqual(test.expected);
      });
    });
  });
});
