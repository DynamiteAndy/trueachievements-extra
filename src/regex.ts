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

export const achievementPage = (str: string): boolean => new RegExp('^/a[0-9]*/', 'i').test(getUrlProperties(str, 'pathname'));
export const achievementsPage = (str: string): boolean => new RegExp('^/game/.*/achievements$', 'i').test(getUrlProperties(str, 'pathname'));
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
export const staffEditWalkthroughPage = (str: string): boolean => new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i').test(getUrlProperties(str, 'pathname'));
export const staffManageWalkthroughPage = (str: string): boolean => new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i').test(getUrlProperties(str, 'pathname'));
export const staffWalkthroughPage = (str: string): boolean => new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i').test(getUrlProperties(str, 'pathname'));
export const staffWalkthroughPreviewPage = (str: string): boolean => new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i').test(getUrlProperties(str, 'pathname'));
export const staffWalkthroughPagePreviewPage = (str: string): boolean => new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i').test(getUrlProperties(str, 'pathname'));
  // // Random Strings
  // summaryAvailable: (str: string) => new RegExp('Summary available for .* at ', 'i').test(str),
  // hasStartedBroadcasting: (str: string) => new RegExp(' has started broadcasting .* on their twitch channel ', 'i').test(str),
  // statusChange: (str: string) => new RegExp('Status change by .* at', 'i').test(str),
export const today = (str: string): boolean => new RegExp('Today', 'i').test(str);
export const yesterday = (str: string): boolean => new RegExp('Yesterday', 'i').test(str);

export const extractBetween = (between: string, str: string): string => {
  const regex = new RegExp(`${between}(.*?)${between}`);
  const matches = str.match(regex)
  
  return matches
    ? matches[1]
    : str;
}

export const extractAllBetween = (between: string, str: string): string[] =>  {
  const regex = new RegExp(`${between}(.*?)${between}`, 'g');
  const matches = str.match(regex)
  
  return matches
    ? matches.map(str => str.replace(between, ''))
    : [str];
}

export default {
  achievementsPage,
  achievementPage,
  staffEditWalkthroughPage,
  staffManageWalkthroughPage,
  staffWalkthroughPage,
  staffWalkthroughPreviewPage,
  today,
  yesterday,
  extractBetween
};
