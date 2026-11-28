import { getAccordions, getSettings } from '@ta-x-test';

import { WalkthroughSettings } from './WalkthroughSettings';

describe('game/walkthrough/WalkthroughSettings', () => {
  test('should render its settings, bound to their settings', () => {
    expect(getSettings(<WalkthroughSettings />)).toEqual([
      ['ta-x-game-walkthrough-hoverable-paragraphs', 'game.walkthrough.hoverableParagraphs']
    ]);
  });

  test('should put them in an accordion', () => {
    expect(getAccordions(<WalkthroughSettings />)).toEqual(['Walkthrough']);
  });
});
