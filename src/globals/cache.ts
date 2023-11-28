import { isAfterNow } from '../utilities/date-util';
import { MemoizedFetch } from '../models/memoized-fetch';
import { GamesRegex } from './regex';

const getMap = <T>(name: string, defaultValue?: ''): Map<string, T> => {
  const value = GM_getValue(name, defaultValue) as string;
  return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
};

const setMap = <T>(name: string, value: Map<string, T>): void => {
  GM_setValue(name, JSON.stringify(Array.from(value.entries())));
};

const getArray = <T>(name: string, defaultValue?: ''): T[] => {
  const value = GM_getValue(name, defaultValue) as string;
  return value.length !== 0 ? JSON.parse(value) : [];
};

export class Cache {
  static get memoize(): Map<string, MemoizedFetch> {
    return getMap('memoized', '');
  }

  static set memoize(value: Map<string, MemoizedFetch>) {
    setMap('memoized', value);
  }

  static get gameAchievementsXboxAchievementsGuideUrl(): Map<string, string> {
    return getMap('gameAchievementsXboxAchievementsGuideUrl', '');
  }

  static set gameAchievementsXboxAchievementsGuideUrl(value: Map<string, string>) {
    setMap('gameAchievementsXboxAchievementsGuideUrl', value);
  }

  static get walkthroughForumOwnerProgressUrl(): Map<string, string> {
    return getMap('walkthroughOwnerProgressUrl', '');
  }

  static set walkthroughForumOwnerProgressUrl(value: Map<string, string>) {
    setMap('walkthroughOwnerProgressUrl', value);
  }

  static get walkthroughPreviewWalkthroughId(): Map<string, string[]> {
    return getMap('previewWalkthroughId', '');
  }

  static set walkthroughPreviewWalkthroughId(value: Map<string, string[]>) {
    setMap('previewWalkthroughId', value);
  }

  static get gameAchievementsDefaultStatusPathName(): string {
    return GM_getValue('gameAchievementsDefaultStatusPathName', '') as string;
  }

  static set gameAchievementsDefaultStatusPathName(value: string) {
    GM_setValue('gameAchievementsDefaultStatusPathName', value);
  }

  static get gameDLCDefaultStatusPathName(): string {
    return GM_getValue('gameDLCDefaultStatusPathName', '') as string;
  }

  static set gameDLCDefaultStatusPathName(value: string) {
    GM_setValue('gameDLCDefaultStatusPathName', value);
  }

  static get gameChallengesDefaultStatusPathName(): string {
    return GM_getValue('gameChallengesDefaultStatusPathName', '') as string;
  }

  static set gameChallengesDefaultStatusPathName(value: string) {
    GM_setValue('gameChallengesDefaultStatusPathName', value);
  }

  static get gameClipsDefaultStatusSelectors(): string[] {
    return getArray('gameClipsDefaultStatusSelectors', '');
  }

  static set gameClipsDefaultStatusSelectors(value: string[]) {
    GM_setValue('gameClipsDefaultStatusSelectors', JSON.stringify(value));
  }

  static get gameForumsDefaultThreadPathName(): string {
    return GM_getValue('gameForumsDefaultThreadPathName', '') as string;
  }

  static set gameForumsDefaultThreadPathName(value: string) {
    GM_setValue('gameForumsDefaultThreadPathName', value);
  }

  static forceClear(): void {
    GM_deleteValue('memoized');
    GM_deleteValue('walkthroughOwnerProgressUrl');
    GM_deleteValue('previewWalkthroughId');
  }

  static clearExpired(): void {
    const updatedCache = Array.from(this.memoize.entries()).filter((item) => isAfterNow(item[1].expiryTime));
    this.memoize = new Map(updatedCache);

    if (!GamesRegex.Test.achievementsUrl()) {
      GM_deleteValue('gameAchievementsDefaultStatusPathName');
    }

    if (!GamesRegex.Test.dlcUrl()) {
      GM_deleteValue('gameDLCDefaultStatusPathName');
    }

    if (!GamesRegex.Test.challengesUrl()) {
      GM_deleteValue('gameChallengesDefaultStatusPathName');
    }

    if (!GamesRegex.Test.clipsUrl()) {
      GM_deleteValue('gameClipsDefaultStatusSelectors');
    }

    if (!GamesRegex.Test.forum()) {
      GM_deleteValue('gameForumsDefaultThreadPathName');
    }
  }

  static clearLegacy(): void {
    GM_deleteValue('trueachievements-extra-memoized');
  }
}
