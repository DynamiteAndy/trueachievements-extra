import { computed, type ReadonlySignal } from '@preact/signals';

import { settings } from './settings-tree';

import type { Setting } from './setting';

// An effective setting, with the settings it reads: a caller applying it live registers those (`settingsFrom`), so an
// inheritance changed here can't leave a caller's list stale
export type EffectiveSetting<T> = ReadonlySignal<T> & {
  from: { override: Setting<boolean>; own: Setting<T>; parent: Setting<T> };
};

// A setting that takes another's value until its override is on. Each setting keeps its own stored value either way, so
// turning the override on brings back what was chosen before
const inherit = <T>(override: Setting<boolean>, own: Setting<T>, parent: Setting<T>): EffectiveSetting<T> =>
  Object.assign(
    computed(() => (override.value ? own.value : parent.value)),
    { from: { override, own, parent } }
  );

// Every setting the given ones read, each once (two from one override share it): an effective setting's three, a plain
// setting itself
export const settingsFrom = (...given: (Setting | EffectiveSetting<unknown>)[]): Setting[] => [
  ...new Set(
    given.flatMap((setting) =>
      'from' in setting ? ([setting.from.override, setting.from.own, setting.from.parent] as Setting[]) : [setting]
    )
  )
];

const { achievements, challenges, dlc, forum: gameForum } = settings.game;
const { forum } = settings;
const { myThreads } = forum;

// The values features act on for the settings that inherit (from achievements, or from the forum-wide thread filter)
// until their override is on. Features read these with .peek(); components can read .value
export const effectiveSettings = {
  dlc: {
    defaultStatus: inherit(dlc.overrideAchievementsPageSettings, dlc.defaultStatus, achievements.defaultStatus),
    defaultStatusValue: inherit(
      dlc.overrideAchievementsPageSettings,
      dlc.defaultStatusValue,
      achievements.defaultStatusValue
    ),
    individualProgress: inherit(
      dlc.overrideAchievementsPageSettings,
      dlc.individualProgress,
      achievements.individualProgress
    ),
    collapsibleGroups: inherit(
      dlc.overrideAchievementsPageSettings,
      dlc.collapsibleGroups,
      achievements.collapsibleGroups
    )
  },
  challenges: {
    individualProgress: inherit(
      challenges.overrideAchievementsIndividualProgress,
      challenges.individualProgress,
      achievements.individualProgress
    )
  },
  gameForum: {
    threadFilter: inherit(gameForum.overrideForumThreadFilter, gameForum.threadFilter, forum.threadFilter),
    threadFilterKeywords: inherit(
      gameForum.overrideForumThreadFilter,
      gameForum.threadFilterKeywords,
      forum.threadFilterKeywords
    )
  },
  myThreads: {
    threadFilter: inherit(myThreads.overrideForumThreadFilter, myThreads.threadFilter, forum.threadFilter),
    threadFilterKeywords: inherit(
      myThreads.overrideForumThreadFilter,
      myThreads.threadFilterKeywords,
      forum.threadFilterKeywords
    )
  }
};
