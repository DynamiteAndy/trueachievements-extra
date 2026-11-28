import { effect } from '@preact/signals';
import { required, setSettings } from '@ta-x-test';

import { type EffectiveSetting, effectiveSettings, settingsFrom } from './effective-settings';
import { settingsList } from './settings-tree';

// [the effective setting, its override, its own setting, the setting it inherits from, a value, another value]
const cases: [string, EffectiveSetting<unknown>, string, string, string, unknown, unknown][] = [
  [
    'dlc.defaultStatus',
    effectiveSettings.dlc.defaultStatus,
    'game.dlc.overrideAchievementsPageSettings',
    'game.dlc.defaultStatus',
    'game.achievements.defaultStatus',
    true,
    false
  ],
  [
    'dlc.defaultStatusValue',
    effectiveSettings.dlc.defaultStatusValue,
    'game.dlc.overrideAchievementsPageSettings',
    'game.dlc.defaultStatusValue',
    'game.achievements.defaultStatusValue',
    'rdoWonAchievements',
    'rdoNotWonAchievements'
  ],
  [
    'dlc.individualProgress',
    effectiveSettings.dlc.individualProgress,
    'game.dlc.overrideAchievementsPageSettings',
    'game.dlc.individualProgress',
    'game.achievements.individualProgress',
    true,
    false
  ],
  [
    'dlc.collapsibleGroups',
    effectiveSettings.dlc.collapsibleGroups,
    'game.dlc.overrideAchievementsPageSettings',
    'game.dlc.collapsibleGroups',
    'game.achievements.collapsibleGroups',
    true,
    false
  ],
  [
    'challenges.individualProgress',
    effectiveSettings.challenges.individualProgress,
    'game.challenges.overrideAchievementsIndividualProgress',
    'game.challenges.individualProgress',
    'game.achievements.individualProgress',
    true,
    false
  ],
  [
    'gameForum.threadFilter',
    effectiveSettings.gameForum.threadFilter,
    'game.forum.overrideForumThreadFilter',
    'game.forum.threadFilter',
    'forum.threadFilter',
    true,
    false
  ],
  [
    'gameForum.threadFilterKeywords',
    effectiveSettings.gameForum.threadFilterKeywords,
    'game.forum.overrideForumThreadFilter',
    'game.forum.threadFilterKeywords',
    'forum.threadFilterKeywords',
    ['halo'],
    ['gears']
  ],
  [
    'myThreads.threadFilter',
    effectiveSettings.myThreads.threadFilter,
    'forum.myThreads.overrideForumThreadFilter',
    'forum.myThreads.threadFilter',
    'forum.threadFilter',
    true,
    false
  ],
  [
    'myThreads.threadFilterKeywords',
    effectiveSettings.myThreads.threadFilterKeywords,
    'forum.myThreads.overrideForumThreadFilter',
    'forum.myThreads.threadFilterKeywords',
    'forum.threadFilterKeywords',
    ['halo'],
    ['gears']
  ]
];

const stored = (path: string): unknown => required(settingsList().find((entry) => entry.path === path)).setting.peek();

describe('effectiveSettings', () => {
  test.each(cases)(
    '%s gives the inherited value while its override is off, keeping its own',
    (_name, effective, override, own, parent, value, other) => {
      setSettings({ [override]: false, [own]: other, [parent]: value });

      expect(effective.peek()).toEqual(value);
      expect(stored(own)).toEqual(other);
    }
  );

  test.each(cases)(
    '%s follows its override and the setting it inherits from as they change',
    (_name, effective, override, own, parent, value, other) => {
      setSettings({ [override]: false, [own]: other, [parent]: value });
      const seen: unknown[] = [];
      const stop = effect(() => {
        seen.push(effective.value);
      });

      setSettings({ [parent]: other });
      setSettings({ [override]: true, [own]: value });
      stop();

      expect(seen).toEqual([value, other, value]);
    }
  );
});

describe('effective settings: the settings each reads', () => {
  const setting = (path: string) => required(settingsList().find((entry) => entry.path === path)).setting;

  test.each(cases)(
    '%s gives its override, its own setting and its parent',
    (_name, effective, override, own, parent) => {
      expect(effective.from).toEqual({
        override: setting(override),
        own: setting(own),
        parent: setting(parent)
      });
    }
  );

  test('settingsFrom lists each once, as two from one override share it', () => {
    const { threadFilter, threadFilterKeywords } = effectiveSettings.myThreads;

    expect(settingsFrom(threadFilter, threadFilterKeywords)).toEqual([
      setting('forum.myThreads.overrideForumThreadFilter'),
      setting('forum.myThreads.threadFilter'),
      setting('forum.threadFilter'),
      setting('forum.myThreads.threadFilterKeywords'),
      setting('forum.threadFilterKeywords')
    ]);
  });

  test('settingsFrom lists a plain setting as itself, once alongside an effective setting that reads it', () => {
    expect(settingsFrom(setting('forum.threadFilter'), effectiveSettings.myThreads.threadFilter)).toEqual([
      setting('forum.threadFilter'),
      setting('forum.myThreads.overrideForumThreadFilter'),
      setting('forum.myThreads.threadFilter')
    ]);
  });
});
