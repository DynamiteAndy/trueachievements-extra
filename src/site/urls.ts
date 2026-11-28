// An address parsed, or an error that names it, which the browser's own doesn't
const parsed = (str: string): URL => {
  try {
    return new URL(str);
  } catch (cause) {
    throw new Error(`${str} is not a valid url`, { cause });
  }
};

// The site's address: the staff pages' addresses start with it, and links read from a fetched page resolve against it
// (not against the page they're read on)
export const siteUrl = 'https://www.trueachievements.com';

// Whether an address (relative ones too) is on the same site as the page, this page by default. The checks below read
// the path alone, so a link to another site's /game/… passes them: a caller reading links checks this first
export const onThisSite = (href: string, page: string = window.location.href): boolean =>
  new URL(href, page).origin === new URL(page).origin;

// Whether a hostname is the host or one of its subdomains (www.xboxachievements.com), and not just a name ending the
// same way (notxboxachievements.com). Both lower case, as a URL's hostname always is
export const onHost = (hostname: string, host: string): boolean => hostname === host || hostname.endsWith(`.${host}`);

// A parameter of an address's query, this page's by default (a thread's tid, a preview's walkthroughid), or null
export const pageParam = (name: string, str: string = window.location.href): string | null =>
  new URL(str).searchParams.get(name);

const achievementUrl = /^\/a[0-9]*\/(?!.*\/).*$/i;
const achievementsUrl = /^\/game\/.*\/achievements$/i;
// The ...WithGamerId checks: a gamerid parameter anywhere in the query (not one only ending in gamerid). Matched in any
// case, so an address naming a gamer in another case still counts as another gamer's page, which pageParam (reading
// lower-case gamerid only) can't then call the signed-in gamer's
const achievementsUrlWithGamerId = /^\/game\/.*\/achievements\?(?:.*&)?gamerid=/i;
const challengesUrl = /^\/game\/.*\/challenges$/i;
const challengesUrlWithGamerId = /^\/game\/.*\/challenges\?(?:.*&)?gamerid=/i;
const clipsUrl = /^\/game\/.*\/videos$/i;
const dlcUrl = /^\/game\/.*\/dlc$/i;
const dlcUrlWithGamerId = /^\/game\/.*\/dlc\?(?:.*&)?gamerid=/i;
const individualDlcUrl = /^\/game\/.*\/dlc\/(?!.*\/).*$/i;
const individualDlcUrlWithGamerId = /^\/game\/.*\/dlc\/.*\?(?:.*&)?gamerid=/i;
const walkthroughUrl = /^\/game\/.*\/walkthrough(?:\/\d+)?$/i;
const gameForumUrl = /^\/game\/.*\/forum$/i;
const gameForumUrlWithAll = /^\/game\/.*\/forum\?type=all/i;
const gameForumUrlWithCommunity = /^\/game\/.*\/forum\?type=community/i;
const gameForumUrlWithGameInfo = /^\/game\/.*\/forum\?type=gameinfo/i;
const productUrl = /^\/products\/[0-9]*\/.*$/i;
const gamesUrl = /^\/games\.aspx/i;
const gameUrl = /^\/game\/.*$/i;
const editWalkthroughUrl = /^\/staff\/walkthrough\/editwalkthroughpage\.aspx/i;
const manageWalkthroughUrl = /^\/staff\/walkthrough\/managewalkthrough\.aspx/i;
const manageWalkthroughUrlWithWalkthroughId = /^\/staff\/walkthrough\/managewalkthrough\.aspx\?walkthroughid=[0-9]*/i;
const walkthroughPageUrl = /^\/staff\/walkthrough\/walkthroughpage\.aspx/i;
const walkthroughPreviewUrl = /^\/staff\/walkthrough\/walkthroughpreview\.aspx/i;
const walkthroughPreviewUrlWithWalkthroughId = /^\/staff\/walkthrough\/walkthroughpreview\.aspx\?walkthroughid=[0-9]*/i;
const walkthroughPagePreviewUrl = /^\/staff\/walkthrough\/walkthroughpagepreview\.aspx/i;
const walkthroughPagePreviewUrlWithPageId = /^\/staff\/walkthrough\/walkthroughpagepreview\.aspx\?pageid=[0-9]*/i;
const autosave = /^\/ajaxfunctions\.aspx\/AutoSave/i;
const forumsUrl = /^\/forum\/forums\.aspx/i;
const myThreadsUrl = /^\/forum\/viewthreads\.aspx/i;
const viewBoardUrlWithBoardId = /^\/forum\/viewboard\.aspx\?messageboardid=[0-9]*/i;
const viewThreadUrlWithThreadId = /^\/forum\/viewthread\.aspx\?tid=[0-9]*/i;
// A news article: /news/<slug> today, /n<id>/<title> on older ones (e.g. /n535/gamer-goals). Not just anything starting
// with /n, which would match /notifications and /newsletters
const newsUrl = /^\/(news\/[^/]+|n\d+\/)/i;
const gamerUrl = /^\/gamer\/.*$/i;
const gamerAchievementsUrl = /^\/gamer\/.*\/achievements$/i;
const winXboxGamesUrl = /^\/win-xbox-games/i;

// XboxAchievements' and PlaystationTrophies' guide pages have the same path, so each check also needs its own site
const guidePage = /^\/game\/.*\/guide((\/$)|$)/i;
const gamertagNationGuide = /^\/game\/[^/]+\/guides\/?$/i;

// A check of an address's path, or of its path and query, against a regex; the page's own address by default
const testPath =
  (regex: RegExp) =>
  (str: string = window.location.href): boolean =>
    regex.test(parsed(str).pathname);
const testPathAndSearch =
  (regex: RegExp) =>
  (str: string = window.location.href): boolean => {
    const { pathname, search } = parsed(str);
    return regex.test(pathname + search);
  };
// A check of an address's host against a site's (its subdomains too). An address that isn't one (whatever the user
// typed into a guide site's box) is on no site, so the guide checks below say it isn't a guide page rather than throw
const onSite = (host: string, str: string): boolean => URL.canParse(str) && onHost(parsed(str).hostname, host);

export const AchievementsRegex = {
  Test: {
    achievementUrl: testPath(achievementUrl)
  }
};

export const GamesRegex = {
  Extract: {
    gameName: (str: string = window.location.href): string =>
      parsed(str).pathname.match(/(?<=\/game\/)[^/]+/)?.[0] ?? ''
  },
  Test: {
    dlc: (str: string = window.location.href): boolean => testPath(dlcUrl)(str) || testPath(individualDlcUrl)(str),
    dlcWithGamerId: (str: string = window.location.href): boolean =>
      testPathAndSearch(dlcUrlWithGamerId)(str) || testPathAndSearch(individualDlcUrlWithGamerId)(str),
    forum: (str: string = window.location.href): boolean =>
      testPath(gameForumUrl)(str) ||
      testPathAndSearch(gameForumUrlWithAll)(str) ||
      testPathAndSearch(gameForumUrlWithCommunity)(str) ||
      testPathAndSearch(gameForumUrlWithGameInfo)(str),

    achievementsUrl: testPath(achievementsUrl),
    achievementsUrlWithGamerId: testPathAndSearch(achievementsUrlWithGamerId),
    clipsUrl: testPath(clipsUrl),
    challengesUrl: testPath(challengesUrl),
    challengesUrlWithGamerId: testPathAndSearch(challengesUrlWithGamerId),
    individualDlcUrl: testPath(individualDlcUrl),
    // A game's forum without a tab named (/game/<name>/forum)
    forumUrl: testPath(gameForumUrl),
    gameUrl: testPath(gameUrl),
    gamesUrl: testPath(gamesUrl),
    walkthroughUrl: testPath(walkthroughUrl)
  }
};

export const GamerRegex = {
  Test: {
    // Any gamer page (gamerUrl covers a gamer's achievements page too)
    all: testPath(gamerUrl),

    gamerAchievementsUrl: testPath(gamerAchievementsUrl)
  }
};

export const AjaxRegex = {
  Test: {
    autosave: testPath(autosave)
  }
};

const staffWalkthroughPages = [
  editWalkthroughUrl,
  manageWalkthroughUrl,
  walkthroughPageUrl,
  walkthroughPreviewUrl,
  walkthroughPagePreviewUrl
];

export const StaffRegex = {
  Walkthroughs: {
    Test: {
      all: (str: string = window.location.href): boolean => staffWalkthroughPages.some((regex) => testPath(regex)(str)),
      preview: (str: string = window.location.href): boolean =>
        testPath(walkthroughPreviewUrl)(str) || testPath(walkthroughPagePreviewUrl)(str),

      editWalkthroughUrl: testPath(editWalkthroughUrl),
      manageWalkthroughUrl: testPath(manageWalkthroughUrl),
      manageWalkthroughUrlWithWalkthroughId: testPathAndSearch(manageWalkthroughUrlWithWalkthroughId),
      walkthroughPageUrl: testPath(walkthroughPageUrl),
      walkthroughPreviewUrlWithWalkthroughId: testPathAndSearch(walkthroughPreviewUrlWithWalkthroughId),
      walkthroughPagePreviewUrlWithPageId: testPathAndSearch(walkthroughPagePreviewUrlWithPageId)
    }
  }
};

export const ForumRegex = {
  Test: {
    all: (str: string = window.location.href): boolean =>
      testPath(forumsUrl)(str) ||
      testPathAndSearch(viewBoardUrlWithBoardId)(str) ||
      testPathAndSearch(viewThreadUrlWithThreadId)(str) ||
      testPath(myThreadsUrl)(str),

    myThreadsUrl: testPath(myThreadsUrl),
    viewBoardUrlWithBoardId: testPathAndSearch(viewBoardUrlWithBoardId),
    viewThreadUrlWithThreadId: testPathAndSearch(viewThreadUrlWithThreadId)
  }
};

export const NewsRegex = {
  Test: {
    newsUrl: testPath(newsUrl)
  }
};

export const ProductRegex = {
  Test: {
    productUrl: testPath(productUrl)
  }
};

export const ExternalRegex = {
  Test: {
    xboxAchievementsGuide: (str: string = window.location.href): boolean =>
      onSite('xboxachievements.com', str) && testPath(guidePage)(str),
    playstationTrophiesGuide: (str: string = window.location.href): boolean =>
      onSite('playstationtrophies.org', str) && testPath(guidePage)(str),
    gamertagNationGuide: (str: string = window.location.href): boolean =>
      onSite('gamertagnation.com', str) && testPath(gamertagNationGuide)(str)
  }
};

export const MiscellaneousRegex = {
  Test: {
    winXboxGamesUrl: testPath(winXboxGamesUrl)
  }
};
