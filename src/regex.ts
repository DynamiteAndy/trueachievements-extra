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

// Achievements
const achievementUrl = new RegExp('^/a[0-9]*/.*', 'i');
const achievementUrlWithGamerId = new RegExp('^/a[0-9]*/.*', 'i');

// Games
const achievementsUrl = new RegExp('^/game/.*/achievements$', 'i');

// dlcAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/dlc\/{1}.*', 'i').test(getUrlProperties(str, 'pathname'));
// allDlcAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/dlc$', 'i').test(getUrlProperties(str, 'pathname'));

// // Gamer Specific
// gamerPage: (str: string) => new RegExp('^\/gamer\/*', 'i').test(getUrlProperties(str, 'pathname')),
// gamerComparisonPage: (str: string) => new RegExp('^\/comparison.aspx\\?gameid=[0-9]*', 'i').test(getUrlProperties(str, [ 'pathname', 'search' ]));
// gamerAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/achievements\\?gamerid=[0-9]*', 'i').test(getUrlProperties(str, [ 'pathname', 'search' ]));
// gamerDlcAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/dlc\/{1}.*\\?gamerid=[0-9]*', 'i').test(getUrlProperties(str, 'pathname'));
// gamerAllDlcAchievementsPage: (str: string) => new RegExp('^\/game\/.*\/dlc\\?gamerid=[0-9]*', 'i').test(getUrlProperties(str, 'pathname'));


// forumThreadPage: (str: string) => new RegExp('^\/forum/viewthread.aspx', 'i').test(getUrlProperties(str, 'pathname')),
// newsArticlePage: (str: string) => new RegExp('^\/n[0-9]*\/', 'i').test(getUrlProperties(str, 'pathname')),

// achievementCommentPage: (str: string) => new RegExp('^\/viewcomment.aspx', 'i').test(getUrlProperties(str, 'pathname')),

// // Ajax Functions
// forumMessageThread: (str: string) => new RegExp('^\/ajaxfunctions.aspx\/Forum_MessageThread', 'i').test(getUrlProperties(str, 'pathname')),

// Staff
// -- Walkthrough
const editWalkthroughUrl = new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i');
const manageWalkthroughUrl = new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i');
const manageWalkthroughUrlWithWalkthroughId = new RegExp('^/staff/walkthrough/managewalkthrough.aspx\\?walkthroughid=[0-9]*', 'i');
const walkthroughPageUrl = new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i');
const walkthroughPreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i');
const walkthroughPagePreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i');
  // // Random Strings
  // summaryAvailable: (str: string) => new RegExp('Summary available for .* at ', 'i').test(str),
  // hasStartedBroadcasting: (str: string) => new RegExp(' has started broadcasting .* on their twitch channel ', 'i').test(str),
  // statusChange: (str: string) => new RegExp('Status change by .* at', 'i').test(str),
const today = new RegExp('Today', 'i');
const yesterday = new RegExp('Yesterday', 'i');

export const extractBetween = (between: string, str: string): string => {
  const regex = new RegExp(`${between}(.*?)${between}`);
  const matches = str.match(regex);
  
  return matches
    ? matches[1]
    : str;
};

export const extractAllBetween = (between: string, str: string): string[] =>  {
  const regex = new RegExp(`${between}(.*?)${between}`, 'g');
  const matches = str.match(regex);
  
  return matches
    ? matches.map(str => str.replace(between, ''))
    : [str];
};

export default {
  achievements: {
    achievementUrl,
    achievementUrlWithGamerId
  },
  game: {
    achievementsUrl
  },
  staff: {
    walkthrough: {
      editWalkthroughUrl,
      manageWalkthroughUrl,
      manageWalkthroughUrlWithWalkthroughId,
      walkthroughPageUrl,
      walkthroughPreviewUrl,
      walkthroughPagePreviewUrl
    }
  },
  words: {
    today,
    yesterday,
  },
  test: {
    achievements: {
      achievementUrl: (str: string): boolean => achievementUrl.test(getUrlProperties(str, 'pathname')),
      achievementUrlWithGamerId: (str: string): boolean => achievementUrlWithGamerId.test(getUrlProperties(str, ['pathname','search']))
    },
    game: {
      achievementsUrl: (str: string): boolean => achievementsUrl.test(getUrlProperties(str, 'pathname'))
    },
    staff: {
      walkthrough: {
        all: (str: string): boolean => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')) ||
        manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')) || manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname','search'])) ||
        walkthroughPageUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) ||
        walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
        preview: (str: string): boolean => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) || walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),

        editWalkthroughUrl: (str: string): boolean => editWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
        manageWalkthroughUrl: (str: string): boolean => manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
        manageWalkthroughUrlWithWalkthroughId: (str: string): boolean => manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname','search'])),
        walkthroughPageUrl: (str: string): boolean => walkthroughPageUrl.test(getUrlProperties(str, 'pathname')),
        walkthroughPreviewUrl: (str: string): boolean => walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')),
        walkthroughPagePreviewUrl: (str: string): boolean => walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname'))
      }
    }
  },
  extractBetween
};
