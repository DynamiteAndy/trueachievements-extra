import { waitForElement } from '@ta-x-page';
import { AchievementsRegex, GamesRegex } from '@ta-x-site';

import { getGuideLinks, setGuideLinks } from './guide-links';
import { getImportedGuides } from './imported-guides';

import type { GuideSite } from './guide-sites';
import type { GuideLink } from './GuideLinks';
import type { ImportedGuide } from './imported-guide';

// The guide for the achievement, and the linked guide page it came from
export type ShownGuide = { url: string; guide: ImportedGuide };

// The game's link in the page's header (an achievement, the achievements or a DLC page)
export const gameLink = '.game h2 a';

// The game's name in its link's address, e.g. Metal-Gear-Solid-HD-Collection; '' for a link outside /game/, or no link
const getGameName = (): string => {
  const link = document.querySelector<HTMLAnchorElement>(gameLink);
  return link ? GamesRegex.Extract.gameName(link.href) : '';
};

// The game's guide pages linked on a site, each with its imported guides read once (none without a game name). Unread
// (an IndexedDB error) reads as not imported, so the section still shows
const readLinkedGuides = async (site: GuideSite): Promise<{ url: string; guides: ImportedGuide[] | null }[]> => {
  const game = getGameName();

  if (game === '') {
    return [];
  }

  return Promise.all(
    getGuideLinks(site.setting, game).map(async (url) => ({
      url,
      guides: await getImportedGuides(url).catch(() => null)
    }))
  );
};

const toGuideLinks = (read: { url: string; guides: ImportedGuide[] | null }[]): GuideLink[] =>
  read.map(({ url, guides }) => ({ url, guides: guides?.length ?? null, importing: false }));

// Saves the game's guide pages linked on a site (nothing without a game name, or they'd be kept under '')
export const saveGuideLinks = (site: GuideSite, links: GuideLink[]): void => {
  const game = getGameName();

  if (game === '') {
    return;
  }

  setGuideLinks(
    site.setting,
    game,
    links.map(({ url }) => url)
  );
};

// On an achievement page, its title (what imported guides are matched by); null on other pages. Read also when the site
// hides the achievement from the viewer (`data-secret`, its title under a "SECRET" overlay), so its guide still shows
export const getAchievementTitle = async (): Promise<string | null> => {
  if (!AchievementsRegex.Test.achievementUrl()) {
    return null;
  }

  return (await waitForElement<HTMLSpanElement>('.ach-panel .title'))?.innerText.trim() ?? null;
};

// A page's guide for the achievement, if it has one with content
const guideIn = (guides: ImportedGuide[] | null, achievementTitle: string): ImportedGuide | undefined => {
  const guide = guides?.find(({ title }) => title === achievementTitle);
  return guide && guide.guide.length !== 0 ? guide : undefined;
};

// The first linked page's guide for the achievement
export const findGuide = async (links: GuideLink[], achievementTitle: string | null): Promise<ShownGuide | null> => {
  if (!achievementTitle) {
    return null;
  }

  for (const { url } of links) {
    const guide = guideIn(await getImportedGuides(url), achievementTitle);

    if (guide) {
      return { url, guide };
    }
  }

  return null;
};

// A site's linked guide pages and its guide for the achievement, loaded before its tab shows (at page load, or when
// it's turned on), so the tab and the achievement's solutions show complete
export type LoadedGuideSite = { links: GuideLink[]; guide: ShownGuide | null };

// Each linked page is read once, for both its count and the achievement's guide. A page that can't be read (an
// IndexedDB error) has no guide, so the section still shows
export const loadGuideSite = async (site: GuideSite, achievementTitle: string | null): Promise<LoadedGuideSite> => {
  const read = await readLinkedGuides(site);
  const found = achievementTitle
    ? read.flatMap(({ url, guides }) => {
        const guide = guideIn(guides, achievementTitle);
        return guide ? [{ url, guide }] : [];
      })[0]
    : undefined;

  return { links: toGuideLinks(read), guide: found ?? null };
};
