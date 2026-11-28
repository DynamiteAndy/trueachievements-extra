// One achievement's guide from a guide site, as saved when the user visits the site's guide page
export type ImportedGuide = {
  // The achievement's title on the guide site, matched against the TrueAchievements achievement's
  title: string;
  // The achievement's own page on the guide site
  href: string;
  // The guide's text as HTML, with links made absolute
  guide: string;
};
