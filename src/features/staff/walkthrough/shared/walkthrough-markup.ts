// The manage walkthrough page's markup in one place, as both features read that page: the manage page's table links on
// the page itself, the walkthrough preview's side column from a fetched copy. With the walkthrough preview's summary
// and address, which both read too

import { parsePostback, siteUrl } from '@ta-x-site';

// The manage page's list row of the selected walkthrough, its panels and its achievements table, and the preview's
// summary
export const walkthroughMarkup = {
  selectedWalkthroughRow: '#lstWalkthroughIDselectedrow',
  achievementsPanel: '#chWalkthroughAchievements',
  gamesPanel: '#chWalkthroughGames',
  gamersPanel: '#chWalkthroughGamers',
  achievementsTable: '#scrolllstWalkthroughAchievementID',
  achievementsTotal: '#lstWalkthroughAchievementID .total',
  gamesTable: '#scrolllstWalkthroughGames',
  gamersTable: '#scrolllstWalkthroughGamers',
  previewGameLinks: '.walkthroughsummary .games a.gamelink',
  previewEditorLinks: '.walkthroughsummary .editors dd a'
} as const;

// The id of the walkthrough selected in the manage page's list, or null when none is. The row's link is a postback
// carrying it: javascript:Postback('lstWalkthroughIDE','<id>')
export const selectedWalkthroughId = (root: ParentNode = document): string | null => {
  const link = root.querySelector<HTMLAnchorElement>(`${walkthroughMarkup.selectedWalkthroughRow} a`);
  const id = link ? parsePostback(link.href)?.argument.trim() : undefined;

  return id && /^\d+$/.test(id) ? id : null;
};

// A walkthrough's preview page. Both features fetch it, so the address must be the same string for them to share its
// cached copy: built here only
export const walkthroughPreviewPath = (walkthroughId: string): string =>
  `/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`;
export const walkthroughPreviewUrl = (walkthroughId: string): string =>
  `${siteUrl}${walkthroughPreviewPath(walkthroughId)}`;

// An achievement (or game, gamer) name as the site lists it in different places: case and the spaces at either end
// aside. Two names are the same when their keys are
export const nameKey = (name: string): string => name.trim().toLowerCase();
export const sameName = (a: string, b: string): boolean => nameKey(a) === nameKey(b);
