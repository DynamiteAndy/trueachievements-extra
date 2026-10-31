import { settings } from '@ta-x-storage';

import type { Setting } from '@ta-x-storage';

const { achievements, challenges, clips, dlc, forum } = settings.game;

// The settings that apply only on a fresh arrival (the defaults below), so a reload doesn't apply them: the settings
// menu's notice says so. The DLC override is one: it switches the DLC default status, and its other settings
// (Individual Progress, Collapsible Groups) apply live
export const settingsAppliedOnArrival: readonly Setting[] = [
  achievements.defaultStatus,
  achievements.defaultStatusValue,
  challenges.defaultStatus,
  challenges.defaultStatusValue,
  clips.defaultStatus,
  clips.defaultRecordedByValue,
  clips.defaultSavedByValue,
  clips.defaultRecordedValue,
  clips.defaultSortByValue,
  dlc.overrideAchievementsPageSettings,
  dlc.defaultStatus,
  dlc.defaultStatusValue,
  forum.defaultThread,
  forum.defaultThreadValue
];
