import { getAccordions } from '@ta-x-test';

import { GameSettings } from './GameSettings';

describe('game/GameSettings', () => {
  test('should render each group as an accordion, in order, with its content after its header', () => {
    expect(getAccordions(<GameSettings />)).toEqual([
      'Achievements',
      'Challenges',
      'Forums',
      'Clips',
      'Walkthrough',
      'DLC',
      'Extra Guides'
    ]);
  });
});
