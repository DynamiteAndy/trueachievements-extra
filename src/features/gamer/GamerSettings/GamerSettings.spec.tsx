import { getSettings } from '@ta-x-test';

import { GamerSettings } from './GamerSettings';

describe('GamerSettings', () => {
  test('should render its settings, bound to their settings', () => {
    expect(getSettings(<GamerSettings />)).toEqual([
      ['ta-x-gamer-achievements-add-group-by-game-button', 'gamer.achievements.addGroupByGameButton']
    ]);
  });
});
