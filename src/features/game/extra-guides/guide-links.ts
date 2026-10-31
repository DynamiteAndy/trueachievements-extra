import { stored } from '@ta-x-storage';

import { importedGuides } from './imported-guides';

// The guide sites whose games can each be linked to guide pages on them, by the key each site's links are kept under
export type GuideLinkSetting =
  | 'gameAchievementsXboxAchievementsGuideUrl'
  | 'gameAchievementsPlaystationTrophiesGuideUrl'
  | 'gameAchievementsGamertagNationGuideUrl';

// Each site's linked guide pages, per game, as [game, links] entries
const guideLinks = {
  gameAchievementsXboxAchievementsGuideUrl: stored<[string, string[]][]>(
    'gameAchievementsXboxAchievementsGuideUrl',
    []
  ),
  gameAchievementsPlaystationTrophiesGuideUrl: stored<[string, string[]][]>(
    'gameAchievementsPlaystationTrophiesGuideUrl',
    []
  ),
  gameAchievementsGamertagNationGuideUrl: stored<[string, string[]][]>('gameAchievementsGamertagNationGuideUrl', [])
};

// A game's linked guide pages on a guide site
export const getGuideLinks = (site: GuideLinkSetting, game: string): string[] =>
  new Map(guideLinks[site].get()).get(game) ?? [];

// Whether any game links a guide page on a site (games can share one: a collection's games, or the same game twice)
export const isGuidePageLinked = (site: GuideLinkSetting, url: string): boolean =>
  guideLinks[site].get().some(([, links]) => links.includes(url));

// Saves a game's guide pages on a site; a game with none left is forgotten
export const setGuideLinks = (site: GuideLinkSetting, game: string, links: string[]): void => {
  const games = new Map(guideLinks[site].get());

  if (links.length === 0) {
    games.delete(game);
  } else {
    games.set(game, links);
  }

  guideLinks[site].set([...games]);
};

// Forgets the stored guides of every guide page no game links: a guide page's guides are kept whenever the user visits
// it, linked or not
export const forgetUnlinkedGuidePages = async (): Promise<void> => {
  const linked = new Set(Object.values(guideLinks).flatMap((site) => site.get().flatMap(([, links]) => links)));
  const unlinked = (await importedGuides.keys()).filter((key) => !linked.has(key));

  await Promise.all(unlinked.map((key) => importedGuides.delete(key)));
};
