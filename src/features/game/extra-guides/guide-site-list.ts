import { ExternalRegex } from '@ta-x-site';
import { type Setting, settings } from '@ta-x-storage';

import { getGamertagNationGuides, getReseroGuides } from './guide-pages';

import type { GuideLinkSetting } from './guide-links';
import type { ImportedGuide } from './imported-guide';

const { extraGuides } = settings.game;

// The guide sites by their tab id
export type GuideSiteId = 'xbox-achievements' | 'playstation-trophies' | 'gamertag-nation';

// A guide site as both ends know it: TrueAchievements, where its guides are shown (guide-sites.tsx adds its tab and
// copy), and the site itself, where readGuidePage reads its guide pages. No Preact here, as this also runs on the sites
export type ListedGuideSite = {
  // The site's tab id (its panel's id is ta-x-tabs-group-<n>-<id>, tab-ids.ts)
  id: GuideSiteId;
  // The site's host, which its pages' hostnames end with
  host: string;
  // The site's home page, and its name as its address (e.g. XboxAchievements.com), which its copy links
  url: string;
  domain: string;
  // Whether the site is turned on in the settings menu
  enabled: Setting<boolean>;
  // Where the game's linked guide pages are kept
  setting: GuideLinkSetting;
  // Whether a link is one of the site's game guide pages
  isGuidePage: (url: string) => boolean;
  // The site's own guides column, there whether the game has guides or not (its "no guide yet" notice), and missing
  // from Cloudflare's check, which is shown at the same address
  page: string;
  // Every achievement's guide on one of its guide pages
  getGuides: (guideDocument: Document, guideUrl: string) => ImportedGuide[];
};

// The guide sites, in their tabs' order and the order their guides go at the top of an achievement's solutions
export const guideSiteList: ListedGuideSite[] = [
  {
    id: 'xbox-achievements',
    host: 'xboxachievements.com',
    url: 'https://www.xboxachievements.com/',
    domain: 'XboxAchievements.com',
    enabled: extraGuides.showXboxAchievementGuides,
    setting: 'gameAchievementsXboxAchievementsGuideUrl',
    isGuidePage: ExternalRegex.Test.xboxAchievementsGuide,
    page: 'section.section .bg-default',
    getGuides: getReseroGuides
  },
  {
    id: 'playstation-trophies',
    host: 'playstationtrophies.org',
    url: 'https://www.playstationtrophies.org/',
    domain: 'PlaystationTrophies.org',
    enabled: extraGuides.showPlaystationTrophyGuides,
    setting: 'gameAchievementsPlaystationTrophiesGuideUrl',
    isGuidePage: ExternalRegex.Test.playstationTrophiesGuide,
    page: 'section.section .bg-default',
    getGuides: getReseroGuides
  },
  {
    id: 'gamertag-nation',
    host: 'gamertagnation.com',
    url: 'https://www.gamertagnation.com/',
    domain: 'GamertagNation.com',
    enabled: extraGuides.showGamertagNationGuides,
    setting: 'gameAchievementsGamertagNationGuideUrl',
    isGuidePage: ExternalRegex.Test.gamertagNationGuide,
    page: '.content',
    getGuides: getGamertagNationGuides
  }
];
