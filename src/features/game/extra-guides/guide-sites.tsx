import type { ComponentChildren } from 'preact';

import { guideSiteList, type GuideSiteId, type ListedGuideSite } from './guide-site-list';
import { GamertagNationIcon } from './icons/GamertagNationIcon';
import { PlaystationTrophiesIcon } from './icons/PlaystationTrophiesIcon';
import { XboxAchievementsIcon } from './icons/XboxAchievementsIcon';
import styles from './styles';

// A guide site (XboxAchievements, PlaystationTrophies, Gamertag Nation) whose guides are shown on a game's achievement
// pages: its entry in guide-site-list, with its tab and copy. The sites answer background requests with a Cloudflare
// challenge, so their guides are read from the guide page in a tab the user's browser opens (importGuidesFrom in
// imported-guides, and readGuidePage on the sites)
export type GuideSite = ListedGuideSite & {
  // The site's tab: its name
  label: string;
  guide: {
    // Shown on the solution, e.g. XboxAchievements
    name: string;
    // Shown under it, e.g. This guide was imported from XboxAchievements.com
    info: string;
    // The site's logo, beside its name
    icon: ComponentChildren;
  };
  // Whether a game can link several guide pages (e.g. a collection split into games); otherwise a new link replaces it
  multiple?: boolean;
  // What the site's tab is for, shown above its linked pages
  summary: ComponentChildren;
  // Shown above the field for adding a guide page, when the game has none, and the field's label
  askInformation: ComponentChildren;
  askLabel: string;
};

// A site's tab and copy as they're written below: its copy is the text after its link ("This game's guides from
// <link>…" and "Please enter a direct link to this game's guide from <link>…"), and its solutions' info names its
// domain
type GuideSiteTab = Omit<GuideSite, keyof ListedGuideSite | 'summary' | 'askInformation' | 'guide'> & {
  summaryAfterLink: ComponentChildren;
  askInformationAfterLink: string;
  guide: Omit<GuideSite['guide'], 'info'>;
};

const defineGuideSite = (
  site: ListedGuideSite,
  { summaryAfterLink, askInformationAfterLink, guide, ...tab }: GuideSiteTab
): GuideSite => {
  // A new link each time: the two texts may show at once
  const siteLink = () => (
    <a href={site.url} target="_blank" rel="noopener noreferrer">
      {site.domain}
    </a>
  );

  return {
    ...site,
    ...tab,
    summary: (
      <>
        This game's guides from {siteLink()}
        {summaryAfterLink}
      </>
    ),
    askInformation: (
      <>
        Please enter a direct link to this game's guide from {siteLink()}
        {askInformationAfterLink}
      </>
    ),
    guide: { ...guide, info: `This guide was imported from ${site.domain}` }
  };
};

const guideSiteTabs: Record<GuideSiteId, GuideSiteTab> = {
  'xbox-achievements': {
    label: 'Xbox Achievements',
    summaryAfterLink: ", shown at the top of each achievement's solutions.",
    askInformationAfterLink: ", I'll remember it next time!",
    askLabel: 'XboxAchievements Url',
    guide: {
      name: 'XboxAchievements',
      icon: <XboxAchievementsIcon class={styles.xboxAchievementsIcon} />
    }
  },
  'playstation-trophies': {
    label: 'Playstation Trophies',
    // A collection on Xbox (e.g. Metal Gear Solid HD Edition) can be a guide page per game on PlayStation
    multiple: true,
    summaryAfterLink:
      ", shown at the top of each achievement's solutions. A game split into several on PlayStation can link each of them.",
    askInformationAfterLink: ", adding one for each game it's split into, I'll remember them next time!",
    askLabel: 'PlaystationTrophies Url',
    guide: {
      name: 'Playstation Trophies',
      icon: <PlaystationTrophiesIcon class={styles.playstationTrophiesIcon} />
    }
  },
  'gamertag-nation': {
    label: 'Gamertag Nation',
    summaryAfterLink: ", shown at the top of each achievement's solutions.",
    askInformationAfterLink: ", I'll remember it next time!",
    askLabel: 'GamertagNation Url',
    guide: {
      name: 'Gamertag Nation',
      icon: <GamertagNationIcon class={styles.gamertagNationIcon} />
    }
  }
};

// The guide sites whose guides are shown on a game's achievement pages, in guide-site-list's order (their tabs', and
// the order their guides go at the top of an achievement's solutions)
export const guideSites: GuideSite[] = guideSiteList.map((site) => defineGuideSite(site, guideSiteTabs[site.id]));
