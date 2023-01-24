import { isBeforeNow } from '../utilities/date-util';
import { MemoizedFetch } from '../models/memoized-fetch';
import { GamesRegex, getUrlProperties } from './regex';

export class Cache {
  static get memoize(): Map<string, MemoizedFetch> { 
    const value = GM_getValue('memoized', '') as string;
    return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
  }
  
  static set memoize(value: Map<string, MemoizedFetch>) {
    GM_setValue('memoized', JSON.stringify(Array.from(value.entries())));
  }

  static get walkthroughForumOwnerProgressUrl(): Map<string, string> { 
    const value = GM_getValue('walkthroughOwnerProgressUrl', '') as string;
    return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
  }

  static set walkthroughForumOwnerProgressUrl(value: Map<string, string>) {
    GM_setValue('walkthroughOwnerProgressUrl', JSON.stringify(Array.from(value.entries())));
  }

  static get walkthroughPreviewWalkthroughId(): Map<string, string[]> { 
    const value = GM_getValue('previewWalkthroughId', '') as string;
    return value.length !== 0 ? new Map(JSON.parse(value)) : new Map();
  }

  static set walkthroughPreviewWalkthroughId(value: Map<string, string[]>) {
    GM_setValue('previewWalkthroughId', JSON.stringify(Array.from(value.entries())));
  }

  static get gameAchievementsDefaultStatusPathName(): string { 
    return GM_getValue('gameAchievementsDefaultStatusPathName', '') as string;
  }

  static set gameAchievementsDefaultStatusPathName(value: string) {
    GM_setValue('gameAchievementsDefaultStatusPathName', value);
  }
  
  static forceClear(): void {
    GM_deleteValue('memoized');
    GM_deleteValue('walkthroughOwnerProgressUrl');
    GM_deleteValue('previewWalkthroughId');
  }

  static clearExpired(): void {
    const updatedCache = Array.from(this.memoize.entries()).filter(item => isBeforeNow(item[1].expiryTime));
    this.memoize = new Map(updatedCache);

    if (!GamesRegex.Test.achievementsUrl()) {
      GM_deleteValue('gameAchievementsDefaultStatusPathName');
    }
  }
  
  static clearLegacy(): void {
    GM_deleteValue('trueachievements-extra-memoized');
  }
}