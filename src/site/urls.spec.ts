import {
  AchievementsRegex,
  GamesRegex,
  StaffRegex,
  GamerRegex,
  AjaxRegex,
  NewsRegex,
  ExternalRegex,
  ForumRegex,
  ProductRegex,
  MiscellaneousRegex,
  onHost,
  onThisSite,
  pageParam
} from './urls';

// Each check, with inputs it should and shouldn't match (or, for an extractor, what it should give)
describe.each<{ name: string; check: (input: string) => unknown; cases: { input: string; expected: unknown }[] }>([
  {
    name: 'AchievementsRegex.Test.achievementUrl',
    check: (input: string) => AchievementsRegex.Test.achievementUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: true },
      { input: 'https://www.trueachievements.com/a223526/and-were-back-achievement?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false },
      { input: 'https://www.trueachievements.com/a12440/suburban-hero-achievement/gamers', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.achievementsUrl',
    check: (input: string) => GamesRegex.Test.achievementsUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: true },
      { input: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.achievementsUrlWithGamerId',
    check: (input: string) => GamesRegex.Test.achievementsUrlWithGamerId(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false },
      { input: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?gamerid=96119', expected: true },
      // Not only first in the query, and in any case
      {
        input: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?foo=1&gamerid=96119',
        expected: true
      },
      { input: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?GamerID=96119', expected: true },
      // A parameter only ending in gamerid names no gamer
      { input: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?notgamerid=96119', expected: false },
      { input: 'https://www.trueachievements.com/game/Digimon-Survive/achievements?foo=gamerid=1', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.dlc',
    check: (input: string) => GamesRegex.Test.dlc(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119', expected: true },
      {
        input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack/achievements',
        expected: false
      },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/achievements', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.dlcWithGamerId',
    check: (input: string) => GamesRegex.Test.dlcWithGamerId(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119', expected: true },
      {
        input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack?gamerid=96119',
        expected: true
      },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?foo=1&gamerid=96119', expected: true },
      {
        input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack?foo=1&gamerid=96119',
        expected: true
      },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc', expected: false },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack', expected: false },
      {
        input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack?notgamerid=1',
        expected: false
      }
    ]
  },
  {
    name: 'GamesRegex.Test.individualDlcUrl',
    check: (input: string) => GamesRegex.Test.individualDlcUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc', expected: false },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc?gamerid=96119', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.gameUrl',
    check: (input: string) => GamesRegex.Test.gameUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Colt-Canyon', expected: true },
      { input: 'https://www.trueachievements.com/games.aspx', expected: false },
      { input: 'https://www.trueachievements.com/gamer/Amoa', expected: false },
      { input: 'https://www.trueachievements.com/a299748/first-boss-achievement', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.gamesUrl',
    check: (input: string) => GamesRegex.Test.gamesUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/games.aspx', expected: true },
      { input: 'https://www.trueachievements.com/games.aspx?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/game/Colt-Canyon', expected: false },
      { input: 'https://www.trueachievements.com/gamer/Amoa/games', expected: false },
      // ".aspx" means the dot, not any character
      { input: 'https://www.trueachievements.com/games-aspx', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.clipsUrl',
    check: (input: string) => GamesRegex.Test.clipsUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/videos', expected: true },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/videos/2', expected: false },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/achievements', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.challengesUrl',
    check: (input: string) => GamesRegex.Test.challengesUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/challenges', expected: true },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/challenges?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/achievements', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.challengesUrlWithGamerId',
    check: (input: string) => GamesRegex.Test.challengesUrlWithGamerId(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/challenges?gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/challenges?foo=1&gamerid=96119', expected: true },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/challenges', expected: false },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/challenges?notgamerid=96119', expected: false },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/achievements?gamerid=96119', expected: false }
    ]
  },
  {
    // The path only: default thread links checks the query's `type` itself
    name: 'GamesRegex.Test.forumUrl',
    check: (input: string) => GamesRegex.Test.forumUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/forum', expected: true },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite', expected: false },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/forums', expected: false },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite/achievements', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.forum',
    check: (input: string) => GamesRegex.Test.forum(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum?type=all', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum?type=community', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum?type=gameinfo', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack', expected: false }
    ]
  },
  {
    name: 'GamesRegex.Test.walkthroughUrl',
    check: (input: string) => GamesRegex.Test.walkthroughUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/game/Truberbrook/walkthrough', expected: true },
      { input: 'https://www.trueachievements.com/game/Truberbrook/walkthrough/12', expected: true },
      { input: 'https://www.trueachievements.com/game/Truberbrook/walkthrough/page-two', expected: false },
      { input: 'https://www.trueachievements.com/game/Truberbrook/walkthroughs', expected: false },
      { input: 'https://www.trueachievements.com/truberbrook-walkthrough.htm', expected: false }
    ]
  },
  {
    name: 'GamerRegex.Test.all',
    check: (input: string) => GamerRegex.Test.all(input),
    cases: [
      { input: 'https://www.trueachievements.com/gamer/Dynamite+Andy', expected: true },
      { input: 'https://www.trueachievements.com/gamer/粉丝游戏-1371/achievements', expected: true },
      { input: 'https://www.trueachievements.com/gamers', expected: false },
      { input: 'https://www.trueachievements.com/game/Amoa', expected: false }
    ]
  },
  {
    name: 'GamerRegex.Test.gamerAchievementsUrl',
    check: (input: string) => GamerRegex.Test.gamerAchievementsUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/gamer/Dynamite+Andy/achievements', expected: true },
      { input: 'https://www.trueachievements.com/gamer/Amoa', expected: false },
      { input: 'https://www.trueachievements.com/gamer/Amoa/achievements/won', expected: false },
      { input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements', expected: false }
    ]
  },
  {
    name: 'StaffRegex.Walkthroughs.Test.all',
    check: (input: string) => StaffRegex.Walkthroughs.Test.all(input),
    cases: [
      { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: true },
      {
        input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
        expected: true
      },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/images.aspx', expected: false },
      // ".aspx" means the dot, not any character
      { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage-aspx', expected: false },
      { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough-aspx', expected: false },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage-aspx', expected: false },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview-aspx', expected: false },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview-aspx', expected: false },
      { input: 'https://www.trueachievements.com/staff/news/editnews.aspx', expected: false },
      { input: 'https://www.trueachievements.com/game/Truberbrook/walkthrough', expected: false }
    ]
  },
  {
    name: 'StaffRegex.Walkthroughs.Test.preview',
    check: (input: string) => StaffRegex.Walkthroughs.Test.preview(input),
    cases: [
      { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: false },
      { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false },
      {
        input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
        expected: false
      },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: false },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: true }
    ]
  },
  {
    name: 'StaffRegex.Walkthroughs.Test.editWalkthroughUrl',
    check: (input: string) => StaffRegex.Walkthroughs.Test.editWalkthroughUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false }
    ]
  },
  {
    name: 'StaffRegex.Walkthroughs.Test.manageWalkthroughUrl',
    check: (input: string) => StaffRegex.Walkthroughs.Test.manageWalkthroughUrl(input),
    cases: [
      {
        input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
        expected: true
      },
      { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/editwalkthroughpage.aspx', expected: false }
    ]
  },
  {
    name: 'StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId',
    check: (input: string) => StaffRegex.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId(input),
    cases: [
      {
        input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=2757',
        expected: true
      },
      { input: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx', expected: false }
    ]
  },
  {
    name: 'StaffRegex.Walkthroughs.Test.walkthroughPreviewUrlWithWalkthroughId',
    check: (input: string) => StaffRegex.Walkthroughs.Test.walkthroughPreviewUrlWithWalkthroughId(input),
    cases: [
      {
        input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=1578',
        expected: true
      },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: false },
      {
        input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx?pageid=7876',
        expected: false
      }
    ]
  },
  {
    name: 'StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId',
    check: (input: string) => StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId(input),
    cases: [
      {
        input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx?pageid=7876',
        expected: true
      },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx', expected: false },
      {
        input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=1578',
        expected: false
      }
    ]
  },
  {
    name: 'StaffRegex.Walkthroughs.Test.walkthroughPageUrl',
    check: (input: string) => StaffRegex.Walkthroughs.Test.walkthroughPageUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx', expected: false }
    ]
  },
  {
    name: 'AjaxRegex.Test.autosave',
    check: (input: string) => AjaxRegex.Test.autosave(input),
    cases: [
      { input: 'https://www.trueachievements.com/ajaxfunctions.aspx/AutoSave', expected: true },
      { input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpage.aspx', expected: false },
      // ".aspx" means the dot, not any character
      { input: 'https://www.trueachievements.com/ajaxfunctions-aspx/AutoSave', expected: false }
    ]
  },
  {
    name: 'NewsRegex.Test.newsUrl',
    check: (input: string) => NewsRegex.Test.newsUrl(input),
    cases: [
      // Today's address, and an older article's with its news id
      { input: 'https://www.trueachievements.com/news/xbox-shocktober-sale-2026', expected: true },
      { input: 'https://www.trueachievements.com/n535/gamer-goals', expected: true },
      // Pages that only start with an n
      { input: 'https://www.trueachievements.com/notifications', expected: false },
      { input: 'https://www.trueachievements.com/newsletters', expected: false },
      { input: 'https://www.trueachievements.com/news', expected: false },
      { input: 'https://www.trueachievements.com/n52547', expected: false }
    ]
  },
  {
    name: 'ForumRegex.Test.all',
    check: (input: string) => ForumRegex.Test.all(input),
    cases: [
      { input: 'https://www.trueachievements.com/forum/forums.aspx', expected: true },
      { input: 'https://www.trueachievements.com/forum/viewthreads.aspx', expected: true },
      { input: 'https://www.trueachievements.com/forum/viewboard.aspx?messageboardid=1431', expected: true },
      { input: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=387144', expected: true },
      { input: 'https://www.trueachievements.com/game/Gears-of-War-4/forum', expected: false },
      { input: 'https://www.trueachievements.com/forum/viewboard.aspx', expected: false },
      { input: 'https://www.trueachievements.com/forum/viewthread.aspx', expected: false },
      // ".aspx" means the dot, not any character
      { input: 'https://www.trueachievements.com/forum/forums-aspx', expected: false },
      { input: 'https://www.trueachievements.com/forum/viewthreads-aspx', expected: false },
      { input: 'https://www.trueachievements.com/forum/viewboard-aspx?messageboardid=1431', expected: false },
      { input: 'https://www.trueachievements.com/forum/viewthread-aspx?tid=387144', expected: false }
    ]
  },
  {
    name: 'ForumRegex.Test.myThreadsUrl',
    check: (input: string) => ForumRegex.Test.myThreadsUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/forum/viewthreads.aspx', expected: true },
      { input: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=387144', expected: false }
    ]
  },
  {
    name: 'ForumRegex.Test.viewBoardUrlWithBoardId',
    check: (input: string) => ForumRegex.Test.viewBoardUrlWithBoardId(input),
    cases: [
      { input: 'https://www.trueachievements.com/forum/viewboard.aspx?messageboardid=1431', expected: true },
      { input: 'https://www.trueachievements.com/forum/viewboard.aspx', expected: false },
      { input: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=387144', expected: false }
    ]
  },
  {
    name: 'ForumRegex.Test.viewThreadUrlWithThreadId',
    check: (input: string) => ForumRegex.Test.viewThreadUrlWithThreadId(input),
    cases: [
      { input: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=387144', expected: true },
      { input: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1629932&anchor=13033388', expected: true },
      { input: 'https://www.trueachievements.com/forum/viewthread.aspx', expected: false },
      { input: 'https://www.trueachievements.com/forum/viewthreads.aspx', expected: false }
    ]
  },
  {
    name: 'ProductRegex.Test.productUrl',
    check: (input: string) => ProductRegex.Test.productUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/products/12345/halo-infinite', expected: true },
      { input: 'https://www.trueachievements.com/products', expected: false },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite', expected: false }
    ]
  },
  {
    name: 'MiscellaneousRegex.Test.winXboxGamesUrl',
    check: (input: string) => MiscellaneousRegex.Test.winXboxGamesUrl(input),
    cases: [
      { input: 'https://www.trueachievements.com/win-xbox-games', expected: true },
      { input: 'https://www.trueachievements.com/game/Halo-Infinite', expected: false }
    ]
  },
  {
    name: 'ExternalRegex.Test.xboxAchievementsGuide',
    check: (input: string) => ExternalRegex.Test.xboxAchievementsGuide(input),
    cases: [
      { input: 'https://www.xboxachievements.com/game/007-legends/guide', expected: true },
      { input: 'https://www.xboxachievements.com/game/a-train-hx-uk/guide/', expected: true },
      { input: 'https://www.trueachievements.com/game/ATrain-HX/achievements', expected: false },
      { input: 'https://www.xboxachievements.com/game/mass-effect/achievements/', expected: false },
      // Another site whose name only ends the same way
      { input: 'https://notxboxachievements.com/game/007-legends/guide', expected: false },
      // The same path on the other Resero Network site
      { input: 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/guide/', expected: false }
    ]
  },
  {
    name: 'ExternalRegex.Test.gamertagNationGuide',
    check: (input: string) => ExternalRegex.Test.gamertagNationGuide(input),
    cases: [
      { input: 'https://www.gamertagnation.com/game/lego-pirates-of-the-caribbean/guides', expected: true },
      { input: 'https://www.gamertagnation.com/game/lego-pirates-of-the-caribbean/guides/', expected: true },
      { input: 'https://www.gamertagnation.com/game/lego-pirates-of-the-caribbean/achievements', expected: false },
      // Its old address
      { input: 'https://www.gamertagnation.com/games.php?g=lego-pirates&do=guides', expected: false },
      { input: 'https://www.xboxachievements.com/game/lego-pirates-of-the-caribbean/guides', expected: false }
    ]
  },
  {
    name: 'ExternalRegex.Test.playstationTrophiesGuide',
    check: (input: string) => ExternalRegex.Test.playstationTrophiesGuide(input),
    cases: [
      { input: 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/guide/', expected: true },
      { input: 'https://www.playstationtrophies.org/game/metal-gear-solid-3-vita/guide', expected: true },
      { input: 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/trophies/', expected: false },
      { input: 'https://www.xboxachievements.com/game/mass-effect/guide/', expected: false }
    ]
  }
])('$name', ({ check, cases }) => {
  test.concurrent.each(cases)('should test regex $input - $expected', ({ input, expected }) => {
    expect(check(input)).toEqual(expected);
  });
});

describe('GamesRegex.Extract.gameName', () => {
  test.concurrent.each([
    {
      input: 'https://www.trueachievements.com/game/Gears-of-War-3/dlc/Horde-Command-Pack',
      expected: 'Gears-of-War-3'
    },
    {
      input: 'https://www.trueachievements.com/game/Colt-Canyon/achievements?gamerid=96119',
      expected: 'Colt-Canyon'
    },
    { input: 'https://www.trueachievements.com/game/BLUD', expected: 'BLUD' }
  ])('should extract $expected from $input', ({ input, expected }) => {
    expect(GamesRegex.Extract.gameName(input)).toEqual(expected);
  });
});

describe('reading an address', () => {
  test('should ignore the hash', () => {
    expect(GamesRegex.Test.achievementsUrl('https://www.trueachievements.com/game/BLUD/achievements#top')).toBe(true);
  });

  test('should throw an Error naming a string that is not a URL, with the browser error as its cause', () => {
    expect(() => GamesRegex.Test.gameUrl('not a url')).toThrow(
      expect.objectContaining({ message: 'not a url is not a valid url', cause: expect.any(TypeError) })
    );
  });

  test.each(['not a url', 'invalid-url', ''])('should say %j is no guide page rather than throw', (input) => {
    expect(ExternalRegex.Test.xboxAchievementsGuide(input)).toBe(false);
    expect(ExternalRegex.Test.playstationTrophiesGuide(input)).toBe(false);
    expect(ExternalRegex.Test.gamertagNationGuide(input)).toBe(false);
  });
});

describe('pageParam', () => {
  test.concurrent.each([
    { name: 'tid', input: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1234567', expected: '1234567' },
    {
      name: 'pageid',
      input: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx?walkthroughid=1&pageid=42',
      expected: '42'
    },
    { name: 'type', input: 'https://www.trueachievements.com/game/BLUD/forum?type=2', expected: '2' },
    { name: 'gamerid', input: 'https://www.trueachievements.com/game/BLUD/achievements', expected: null }
  ])('should read $name from $input', ({ name, input, expected }) => {
    expect(pageParam(name, input)).toBe(expected);
  });
});

describe('onThisSite', () => {
  const page = 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1416296';

  test.concurrent.each([
    { href: '/game/Digimon-Survive/walkthrough', expected: true },
    { href: 'https://www.trueachievements.com/game/Digimon-Survive', expected: true },
    { href: 'https://www.xboxachievements.com/game/digimon-survive/guide/', expected: false },
    // Another of the site's hosts (no www) is another origin, as the page's own checks had it
    { href: 'https://trueachievements.com/game/Digimon-Survive', expected: false },
    { href: 'http://www.trueachievements.com/game/Digimon-Survive', expected: false }
  ])('$href is on the page’s site: $expected', ({ href, expected }) => {
    expect(onThisSite(href, page)).toBe(expected);
  });
});

describe('onHost', () => {
  test.concurrent.each([
    { hostname: 'xboxachievements.com', expected: true },
    { hostname: 'www.xboxachievements.com', expected: true },
    { hostname: 'notxboxachievements.com', expected: false },
    { hostname: 'xboxachievements.com.example.org', expected: false }
  ])('$hostname is on xboxachievements.com: $expected', ({ hostname, expected }) => {
    expect(onHost(hostname, 'xboxachievements.com')).toBe(expected);
  });
});
