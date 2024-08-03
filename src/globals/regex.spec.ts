import {
  AchievementsRegex,
  GamesRegex,
  StaffRegex,
  GamerRegex,
  DatesRegex,
  AjaxRegex,
  SentencesRegex,
  NewsRegex,
  ExternalRegex
} from './regex';

describe('AchievementsRegex', () => {
  describe('achievementUrl', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: true },
      { input: 'https://www.trueachievements.com/a223526/and-were-back-achievement?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false },
      { input: 'https://www.trueachievements.com/a12440/suburban-hero-achievement/gamers', expected: false }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(AchievementsRegex.Test.achievementUrl(input)).toEqual(expected);
    });
  });

  describe('achievementUrlWithGamerId', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: false },
      { input: 'https://www.trueachievements.com/a223526/and-were-back-achievement?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false },
      { input: 'https://www.trueachievements.com/a12440/suburban-hero-achievement/gamers', expected: false }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(AchievementsRegex.Test.achievementUrlWithGamerId(input)).toEqual(expected);
    });
  });
});

describe('GamesRegex', () => {
  describe('achievementsUrl', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: true },
      { input: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: false }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamesRegex.Test.achievementsUrl(input)).toEqual(expected);
    });
  });

  describe('achievementsUrlWithGamerId', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false },
      { input: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?gamerid=96119', expected: true }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamesRegex.Test.achievementsUrlWithGamerId(input)).toEqual(expected);
    });
  });

  describe('dlcUrl', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack', expected: false }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamesRegex.Test.dlcUrl(input)).toEqual(expected);
    });
  });

  describe('dlcUrlWithGamerId', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119', expected: true },
      {
        input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack?gamerid=96119',
        expected: false
      }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamesRegex.Test.dlcUrlWithGamerId(input)).toEqual(expected);
    });
  });

  describe('individualDlcUrl', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc', expected: false },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119', expected: false }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamesRegex.Test.individualDlcUrl(input)).toEqual(expected);
    });
  });

  describe('individualDlcUrlWithGamerId', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119', expected: false },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack', expected: false },
      {
        input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack?gamerid=96119',
        expected: true
      }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamesRegex.Test.individualDlcUrlWithGamerId(input)).toEqual(expected);
    });
  });

  describe('gameUrl', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/game/Colt-Canyon', expected: true },
      { input: 'https://www.trueachievements.com/game/Shadows-of-the-Damned', expected: true }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamesRegex.Test.gameUrl(input)).toEqual(expected);
    });
  });

  describe('forum', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum?type=all', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum?type=community', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum?type=gameinfo', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack', expected: false }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamesRegex.Test.forum(input)).toEqual(expected);
    });
  });
});

describe('GamerRegex', () => {
  describe('all', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/gamer/Dynamite+Andy', expected: true },
      { input: 'https://www.trueachievements.com/gamer/Amoa', expected: true },
      { input: 'https://www.trueachievements.com/gamer/粉丝游戏-1371', expected: true },
      { input: 'https://www.trueachievements.com/gamer/Dynamite+Andy/achievements', expected: true },
      { input: 'https://www.trueachievements.com/gamer/Amoa/achievements', expected: true },
      { input: 'https://www.trueachievements.com/gamer/粉丝游戏-1371/achievements', expected: true }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamerRegex.Test.all(input)).toEqual(expected);
    });
  });

  describe('gamerUrl', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/gamer/Dynamite+Andy', expected: true },
      { input: 'https://www.trueachievements.com/gamer/Amoa', expected: true },
      { input: 'https://www.trueachievements.com/gamer/粉丝游戏-1371', expected: true }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamerRegex.Test.gamerUrl(input)).toEqual(expected);
    });
  });

  describe('gamerAchievementsUrl', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/gamer/Dynamite+Andy/achievements', expected: true },
      { input: 'https://www.trueachievements.com/gamer/Amoa/achievements', expected: true },
      { input: 'https://www.trueachievements.com/gamer/粉丝游戏-1371/achievements', expected: true }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(GamerRegex.Test.gamerAchievementsUrl(input)).toEqual(expected);
    });
  });
});

describe('StaffRegex', () => {
  describe('Walkthroughs', () => {
    describe('all', () => {
      test.concurrent.each([
        { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: true },
        {
          input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
          expected: true
        },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true }
      ])('should test regex $input - $expected', ({ input, expected }) => {
        expect(StaffRegex.Walkthroughs.Test.all(input)).toEqual(expected);
      });
    });

    describe('preview', () => {
      test.concurrent.each([
        { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: false },
        { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false },
        {
          input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
          expected: false
        },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: false },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true }
      ])('should test regex $input - $expected', ({ input, expected }) => {
        expect(StaffRegex.Walkthroughs.Test.preview(input)).toEqual(expected);
      });
    });

    describe('editWalkthroughUrl', () => {
      test.concurrent.each([
        { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false }
      ])('should test regex $input - $expected', ({ input, expected }) => {
        expect(StaffRegex.Walkthroughs.Test.editWalkthroughUrl(input)).toEqual(expected);
      });
    });

    describe('manageWalkthroughUrl', () => {
      test.concurrent.each([
        {
          input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
          expected: true
        },
        { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: false }
      ])('should test regex $input - $expected', ({ input, expected }) => {
        expect(StaffRegex.Walkthroughs.Test.manageWalkthroughUrl(input)).toEqual(expected);
      });
    });

    describe('manageWalkthroughUrlWithWalkthroughId', () => {
      test.concurrent.each([
        {
          input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
          expected: true
        },
        { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false }
      ])('should test regex $input - $expected', ({ input, expected }) => {
        expect(StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId(input)).toEqual(expected);
      });
    });

    describe('walkthroughPageUrl', () => {
      test.concurrent.each([
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: false }
      ])('should test regex $input - $expected', ({ input, expected }) => {
        expect(StaffRegex.Walkthroughs.Test.walkthroughPageUrl(input)).toEqual(expected);
      });
    });

    describe('walkthroughPreviewUrl', () => {
      test.concurrent.each([
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: false }
      ])('should test regex $input - $expected', ({ input, expected }) => {
        expect(StaffRegex.Walkthroughs.Test.walkthroughPreviewUrl(input)).toEqual(expected);
      });
    });

    describe('walkthroughPagePreviewUrl', () => {
      test.concurrent.each([
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
        { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: false }
      ])('should test regex $input - $expected', ({ input, expected }) => {
        expect(StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrl(input)).toEqual(expected);
      });
    });
  });
});

describe('AjaxRegex', () => {
  describe('autosave', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/ajaxfunctions.aspx/AutoSave', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: false }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(AjaxRegex.Test.autosave(input)).toEqual(expected);
    });
  });
});

describe('NewsRegex', () => {
  describe('newsUrl', () => {
    test.concurrent.each([
      { input: 'https://www.trueachievements.com/n52547/xbox-sale-roundup-january-17th-2023', expected: true },
      {
        input: 'https://www.trueachievements.com/n46401/xbox-ultimate-game-sale-roundup-july-23rd-2021',
        expected: true
      },
      {
        input: 'https://www.trueachievements.com/n52555/easy-achievements-gamerscore-xbox-sale-january-17',
        expected: true
      }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(NewsRegex.Test.newsUrl(input)).toEqual(expected);
    });
  });
});

describe('DatesRegex', () => {
  describe('today', () => {
    test.concurrent.each([
      { input: 'today', expected: true },
      { input: 'Today', expected: true }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(DatesRegex.today.test(input)).toEqual(expected);
    });
  });

  describe('yesterday', () => {
    test.concurrent.each([
      { input: 'yesterday', expected: true },
      { input: 'Yesterday', expected: true }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(DatesRegex.yesterday.test(input)).toEqual(expected);
    });
  });
});

describe('SentencesRegex', () => {
  describe('discussWalkthrough', () => {
    test.concurrent.each([
      {
        input: 'Please use this thread to discuss the The Witcher 2: Assassins of Kings (EU Ver) walkthrough',
        expected: true
      },
      {
        input: 'Please use this thread to discuss the Jurassic World Evolution 2 walkthrough.',
        expected: true
      }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(SentencesRegex.discussWalkthrough.test(input)).toEqual(expected);
    });
  });

  describe('walkthroughPublished', () => {
    test.concurrent.each([
      {
        input:
          'The walkthrough has now been published.\n\nYou can find it here: The Witcher 2: Assassins of Kings (EU Ver) Walkthrough',
        expected: true
      },
      {
        input: 'The walkthrough has now been published.\n\nYou can find it here: Outer Wilds Walkthrough',
        expected: true
      }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(SentencesRegex.walkthroughPublished.test(input)).toEqual(expected);
    });
  });
});

describe('ExternalRegex', () => {
  describe('xboxAchievementsGuide', () => {
    test.concurrent.each([
      { input: 'https://www.xboxachievements.com/game/007-legends/guide', expected: true },
      { input: 'https://www.xboxachievements.com/game/a-train-hx-uk/guide/', expected: true },
      { input: 'https://www.trueachievements.com/game/ATrain-HX/achievements', expected: false }
    ])('should test regex $input - $expected', ({ input, expected }) => {
      expect(ExternalRegex.Test.xboxAchievementsGuide(input)).toEqual(expected);
    });
  });
});
