import { settings, settingsList } from '@ta-x-storage';

import { settingId } from './setting-id';

describe('ui/settings/setting-id', () => {
  test("should make a control's id from its setting's key, in kebab case", () => {
    expect(settingId(settings.game.achievements.individualProgress)).toBe('ta-x-game-achievements-individual-progress');
  });

  test('should give every setting an id of its own', () => {
    const ids = settingsList().map(({ setting }) => settingId(setting));

    expect(new Set(ids).size).toBe(ids.length);
  });
});
