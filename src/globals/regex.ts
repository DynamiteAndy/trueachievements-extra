export const getUrlProperties = (str: string, props: string|string[] = []) => {
  props = Array.isArray(props) ? props : [props];

  try {
    const url = new URL(str);
    let constructedString = '';

    for (let i = 0; i < props.length; i++) {
      if (!url[props[i]]) continue;

      constructedString += url[props[i]];
    }

    return constructedString;
  } catch (ex) {
    throw `${str} is not a valid url`;
  }
};

const achievementUrl = new RegExp('^/a[0-9]*/.*', 'i');
const achievementUrlWithGamerId = new RegExp('^/a[0-9]*/.*\\?gamerid=[0-9]*', 'i');
const achievementsUrl = new RegExp('^/game/.*/achievements$', 'i');
const clipsUrl = new RegExp('^/game/.*/videos$', 'i');
const achievementsUrlWithGamerId = new RegExp('^/game/.*/achievements\\?gamerid=[0-9]*', 'i');
const walkthroughUrl = new RegExp('^/game/.*/walkthrough$', 'i');
const gamesUrl = new RegExp('^/games.aspx', 'i');
const gameUrl = new RegExp('^/game/.*$', 'i');
const editWalkthroughUrl = new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i');
const manageWalkthroughUrl = new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i');
const manageWalkthroughUrlWithWalkthroughId = new RegExp('^/staff/walkthrough/managewalkthrough.aspx\\?walkthroughid=[0-9]*', 'i');
const walkthroughPageUrl = new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i');
const walkthroughPreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i');
const walkthroughPreviewUrlWithWalkthroughId = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx\\?walkthroughid=[0-9]*', 'i');
const walkthroughPagePreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i');
const walkthroughPagePreviewUrlWithPageId = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx\\?pageid=[0-9]*', 'i');
const autosave = new RegExp('^/ajaxfunctions.aspx/AutoSave', 'i');
const forumsUrl = new RegExp('^/forum/forums.aspx', 'i');
const viewBoardUrlWithBoardId = new RegExp('^/forum/viewboard.aspx\\?messageboardid=[0-9]*', 'i');
const viewThreadUrlWithThreadId = new RegExp('^/forum/viewthread.aspx\\?tid=[0-9]*', 'i');
const newsUrl = new RegExp('^/n[0-9]*/*', 'i');
const gamerUrl = new RegExp('^/gamer/.*$', 'i');
const gamerAchievementsUrl = new RegExp('^/gamer/.*/achievements$', 'i');

export const AchievementsRegex = {
  achievementUrl,
  achievementUrlWithGamerId,
  Test: {
    achievementUrl: (str: string = window.location.href): boolean => achievementUrl.test(getUrlProperties(str, 'pathname')),
    achievementUrlWithGamerId: (str: string = window.location.href): boolean => achievementUrlWithGamerId.test(getUrlProperties(str, ['pathname','search']))
  }
};

export const GamesRegex = {
  achievementsUrl,
  achievementsUrlWithGamerId,
  clipsUrl,
  gameUrl,
  gamesUrl,
  walkthroughUrl,
  Test: {
    achievementsUrl: (str: string = window.location.href): boolean => achievementsUrl.test(getUrlProperties(str, 'pathname')),
    achievementsUrlWithGamerId: (str: string = window.location.href): boolean => achievementsUrlWithGamerId.test(getUrlProperties(str, ['pathname','search'])),
    clipsUrl: (str: string = window.location.href): boolean => clipsUrl.test(getUrlProperties(str, 'pathname')),
    gameUrl: (str: string = window.location.href): boolean => gameUrl.test(getUrlProperties(str, 'pathname')),
    gamesUrl: (str: string = window.location.href): boolean => gamesUrl.test(getUrlProperties(str, 'pathname')),
    walkthroughUrl: (str: string = window.location.href): boolean => walkthroughUrl.test(getUrlProperties(str, 'pathname'))
  }
};

export const GamerRegex = {
  gamerUrl,
  gamerAchievementsUrl,
  Test: {
    all: (str: string = window.location.href): boolean => gamerUrl.test(getUrlProperties(str, 'pathname')) ||
    gamerAchievementsUrl.test(getUrlProperties(str, 'pathname')),

    gamerUrl: (str: string = window.location.href): boolean => gamerUrl.test(getUrlProperties(str, 'pathname')),
    gamerAchievementsUrl: (str: string = window.location.href): boolean => gamerAchievementsUrl.test(getUrlProperties(str, 'pathname'))
  }
};

export const AjaxRegex = {
  autosave,
  Test: {
    autosave: (str: string = window.location.href): boolean => autosave.test(getUrlProperties(str, 'pathname'))
  }
};

export const StaffRegex = {
  Walkthroughs: {
    editWalkthroughUrl,
    manageWalkthroughUrl,
    manageWalkthroughUrlWithWalkthroughId,
    walkthroughPageUrl,
    walkthroughPreviewUrl,
    walkthroughPreviewUrlWithWalkthroughId,
    walkthroughPagePreviewUrl,
    walkthroughPagePreviewUrlWithPageId,
    Test: {
      all: (str: string = window.location.href): boolean => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')) ||
      manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPageUrl.test(getUrlProperties(str, 'pathname')) ||
      walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
      preview: (str: string = window.location.href): boolean => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),

      editWalkthroughUrl: (str: string = window.location.href): boolean => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
      manageWalkthroughUrl: (str: string = window.location.href): boolean => manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
      manageWalkthroughUrlWithWalkthroughId: (str: string = window.location.href): boolean => manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname','search'])),
      walkthroughPageUrl: (str: string = window.location.href): boolean => walkthroughPageUrl.test(getUrlProperties(str, 'pathname')),
      walkthroughPreviewUrl: (str: string = window.location.href): boolean => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')),
      walkthroughPreviewUrlWithWalkthroughId: (str: string = window.location.href): boolean => walkthroughPreviewUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname','search'])),
      walkthroughPagePreviewUrl: (str: string = window.location.href): boolean => walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
      walkthroughPagePreviewUrlWithPageId: (str: string = window.location.href): boolean => walkthroughPagePreviewUrlWithPageId.test(getUrlProperties(str, ['pathname','search']))
    }
  }
};

export const ForumRegex = {
  forumsUrl,
  viewBoardUrlWithBoardId,
  viewThreadUrlWithThreadId,
  Test: {
    all: (str: string = window.location.href): boolean => forumsUrl.test(getUrlProperties(str, 'pathname')) ||
      viewBoardUrlWithBoardId.test(getUrlProperties(str, ['pathname','search'])) ||
      viewThreadUrlWithThreadId.test(getUrlProperties(str, ['pathname','search'])),

    forumsUrl: (str: string = window.location.href): boolean => forumsUrl.test(getUrlProperties(str, 'pathname')),
    viewBoardUrlWithBoardId: (str: string = window.location.href): boolean => viewBoardUrlWithBoardId.test(getUrlProperties(str, ['pathname','search'])),
    viewThreadUrlWithThreadId: (str: string = window.location.href): boolean => viewThreadUrlWithThreadId.test(getUrlProperties(str, ['pathname','search']))
  }
};

export const NewsRegex = {
  newsUrl,
  Test: {
    newsUrl: (str: string = window.location.href): boolean => newsUrl.test(getUrlProperties(str, 'pathname'))
  }
};

export const DatesRegex = {
  today: new RegExp('Today', 'i'),
  yesterday: new RegExp('Yesterday', 'i')
};

export const SentencesRegex = {
  discussWalkthrough: new RegExp('^Please use this thread to discuss the .* walkthrough?.$'),
  walkthroughPublished: new RegExp('^The walkthrough has now been published.(?:\\n\\n)?You can find it here: .* Walkthrough?.$')
};

export default {
  AchievementsRegex,
  GamesRegex,
  GamerRegex,
  StaffRegex,
  ForumRegex,
  DatesRegex,
  SentencesRegex,
  NewsRegex
};
