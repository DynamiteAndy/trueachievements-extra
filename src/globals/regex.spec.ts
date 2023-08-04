import {
  AchievementsRegex,
  GamesRegex,
  StaffRegex,
  GamerRegex,
  DatesRegex,
  AjaxRegex,
  SentencesRegex,
  NewsRegex
} from './regex';

describe('regex', () => {
  describe('achievementsRegex', () => {
    describe('achievementUrl', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: true },
        {
          case: 'https://www.trueachievements.com/a223526/and-were-back-achievement?gamerid=96119',
          expected: true
        },
        { case: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(AchievementsRegex.Test.achievementUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('achievementUrlWithGamerId', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/a299748/first-boss-achievement',
          expected: false
        },
        {
          case: 'https://www.trueachievements.com/a223526/and-were-back-achievement?gamerid=96119',
          expected: true
        },
        { case: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(AchievementsRegex.Test.achievementUrlWithGamerId(test.case)).toEqual(test.expected);
        });
      });
    });
  });

  describe('gamesRegex', () => {
    describe('achievementsUrl', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: true },
        { case: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: false }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamesRegex.Test.achievementsUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('achievementsUrlWithGamerId', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false },
        {
          case: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?gamerid=96119',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamesRegex.Test.achievementsUrlWithGamerId(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('dlcUrl', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc', expected: true },
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamesRegex.Test.dlcUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('dlcUrlWithGamerId', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack?gamerid=96119',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamesRegex.Test.dlcUrlWithGamerId(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('individualDlcUrl', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc', expected: false },
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119',
          expected: false
        },
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamesRegex.Test.individualDlcUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('individualDlcUrlWithGamerId', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119',
          expected: false
        },
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack',
          expected: false
        },
        {
          case: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack?gamerid=96119',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamesRegex.Test.individualDlcUrlWithGamerId(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('gameUrl', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/game/Colt-Canyon', expected: true },
        { case: 'https://www.trueachievements.com/game/Shadows-of-the-Damned', expected: true }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamesRegex.Test.gameUrl(test.case)).toEqual(test.expected);
        });
      });
    });
  });

  describe('gamerRegex', () => {
    describe('all', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/gamer/Dynamite+Andy', expected: true },
        { case: 'https://www.trueachievements.com/gamer/Belindo152', expected: true },
        { case: 'https://www.trueachievements.com/gamer/粉丝游戏-1371', expected: true },
        {
          case: 'https://www.trueachievements.com/gamer/Dynamite+Andy/achievements',
          expected: true
        },
        { case: 'https://www.trueachievements.com/gamer/Amoa/achievements', expected: true },
        {
          case: 'https://www.trueachievements.com/gamer/粉丝游戏-1371/achievements',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamerRegex.Test.all(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('gamerUrl', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/gamer/Dynamite+Andy', expected: true },
        { case: 'https://www.trueachievements.com/gamer/Belindo152', expected: true },
        { case: 'https://www.trueachievements.com/gamer/粉丝游戏-1371', expected: true }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamerRegex.Test.gamerUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('gamerAchievementsUrl', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/gamer/Dynamite+Andy/achievements',
          expected: true
        },
        { case: 'https://www.trueachievements.com/gamer/Amoa/achievements', expected: true },
        {
          case: 'https://www.trueachievements.com/gamer/粉丝游戏-1371/achievements',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(GamerRegex.Test.gamerAchievementsUrl(test.case)).toEqual(test.expected);
        });
      });
    });
  });

  describe('staffWalkthroughsRegex', () => {
    describe('staff - walkthrough - all', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(StaffRegex.Walkthroughs.Test.all(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('staff - walkthrough - preview', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx',
          expected: false
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx',
          expected: false
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
          expected: false
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx',
          expected: false
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(StaffRegex.Walkthroughs.Test.preview(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('editWalkthroughUrl', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(StaffRegex.Walkthroughs.Test.editWalkthroughUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('manageWalkthroughUrl', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(StaffRegex.Walkthroughs.Test.manageWalkthroughUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('manageWalkthroughUrlWithWalkthroughId', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('walkthroughPageUrl', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(StaffRegex.Walkthroughs.Test.walkthroughPageUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('walkthroughPreviewUrl', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(StaffRegex.Walkthroughs.Test.walkthroughPreviewUrl(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('walkthroughPagePreviewUrl', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrl(test.case)).toEqual(test.expected);
        });
      });
    });
  });

  describe('ajaxRegex', () => {
    describe('autosave', () => {
      const testCases = [
        { case: 'https://www.trueachievements.com/ajaxfunctions.aspx/AutoSave', expected: true },
        {
          case: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx',
          expected: false
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(AjaxRegex.Test.autosave(test.case)).toEqual(test.expected);
        });
      });
    });
  });

  describe('datesRegex', () => {
    describe('today', () => {
      const testCases = [
        { case: 'today', expected: true },
        { case: 'Today', expected: true }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(DatesRegex.today.test(test.case)).toEqual(test.expected);
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
          expect(DatesRegex.yesterday.test(test.case)).toEqual(test.expected);
        });
      });
    });
  });

  describe('sentencesRegex', () => {
    describe('discussWalkthrough', () => {
      const testCases = [
        {
          case: 'Please use this thread to discuss the The Witcher 2: Assassins of Kings (EU Ver) walkthrough',
          expected: true
        },
        {
          case: 'Please use this thread to discuss the Jurassic World Evolution 2 walkthrough.',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(SentencesRegex.discussWalkthrough.test(test.case)).toEqual(test.expected);
        });
      });
    });

    describe('walkthroughPublished', () => {
      const testCases = [
        {
          case: 'The walkthrough has now been published.\n\nYou can find it here: The Witcher 2: Assassins of Kings (EU Ver) Walkthrough',
          expected: true
        },
        {
          case: 'The walkthrough has now been published.\n\nYou can find it here: Outer Wilds Walkthrough',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(SentencesRegex.walkthroughPublished.test(test.case)).toEqual(test.expected);
        });
      });
    });
  });

  describe('newsRegex', () => {
    describe('newsUrl', () => {
      const testCases = [
        {
          case: 'https://www.trueachievements.com/n52547/xbox-sale-roundup-january-17th-2023',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/n46401/xbox-ultimate-game-sale-roundup-july-23rd-2021',
          expected: true
        },
        {
          case: 'https://www.trueachievements.com/n52555/easy-achievements-gamerscore-xbox-sale-january-17',
          expected: true
        }
      ];

      testCases.forEach((test, index) => {
        it(`should test regex "${test.case}" correctly (testcase: ${index + 1})`, () => {
          expect(NewsRegex.Test.newsUrl(test.case)).toEqual(test.expected);
        });
      });
    });
  });
});
