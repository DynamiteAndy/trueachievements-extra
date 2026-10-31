import { allConcurrently } from '@ta-x-lib';
import { GamesRegex } from '@ta-x-site';

import hoverableParagraphs from './hoverable-paragraphs';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.walkthroughUrl()) {
    return;
  }

  await allConcurrently('Game Walkthrough', [
    { name: 'game:walkthrough:hoverable-paragraphs', task: hoverableParagraphs }
  ]);
};
