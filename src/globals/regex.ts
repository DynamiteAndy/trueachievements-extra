const getUrlProperties = (str: string, props: string|string[] = []) => {
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
const achievementUrlWithGamerId = new RegExp('^/a[0-9]*/.*', 'i');
const achievementsUrl = new RegExp('^/game/.*/achievements$', 'i');
const walkthroughUrl = new RegExp('^/game/.*/walkthrough$', 'i');
const gameUrl = new RegExp('^/game/.*$', 'i');
const editWalkthroughUrl = new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i');
const manageWalkthroughUrl = new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i');
const manageWalkthroughUrlWithWalkthroughId = new RegExp('^/staff/walkthrough/managewalkthrough.aspx\\?walkthroughid=[0-9]*', 'i');
const walkthroughPageUrl = new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i');
const walkthroughPreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i');
const walkthroughPagePreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i');
const autosave = new RegExp('^/ajaxfunctions.aspx/AutoSave', 'i');
const forumsUrl = new RegExp('^/forum/forums.aspx', 'i');
const viewBoardUrlWithBoardId = new RegExp('^/forum/viewboard.aspx\\?messageboardid=[0-9]*', 'i');
const viewThreadUrlWithThreadId = new RegExp('^/forum/viewthread.aspx\\?tid=[0-9]*', 'i');

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
  gameUrl,
  walkthroughUrl,
  Test: {
    achievementsUrl: (str: string = window.location.href): boolean => achievementsUrl.test(getUrlProperties(str, 'pathname')),
    gameUrl: (str: string = window.location.href): boolean => gameUrl.test(getUrlProperties(str, 'pathname')),
    walkthroughUrl: (str: string = window.location.href): boolean => walkthroughUrl.test(getUrlProperties(str, 'pathname'))
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
    walkthroughPagePreviewUrl,
    Test: {
      all: (str: string = window.location.href): boolean => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')) ||
      manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')) || manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname','search'])) ||
      walkthroughPageUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) ||
      walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
      preview: (str: string = window.location.href): boolean => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),

      editWalkthroughUrl: (str: string = window.location.href): boolean => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
      manageWalkthroughUrl: (str: string = window.location.href): boolean => manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
      manageWalkthroughUrlWithWalkthroughId: (str: string = window.location.href): boolean => manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname','search'])),
      walkthroughPageUrl: (str: string = window.location.href): boolean => walkthroughPageUrl.test(getUrlProperties(str, 'pathname')),
      walkthroughPreviewUrl: (str: string = window.location.href): boolean => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')),
      walkthroughPagePreviewUrl: (str: string = window.location.href): boolean => walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname'))
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
  StaffRegex,
  ForumRegex,
  DatesRegex,
  SentencesRegex
};
