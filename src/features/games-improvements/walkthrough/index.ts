import { GamesRegex } from '@ta-x-globals';
import { allConcurrently } from '@ta-x-utilities';
import hoverableParagraphs from './hoverable-paragraphs';

export default async (): Promise<void> => {
  if (!GamesRegex.Test.walkthroughUrl()) {
    return;
  }

  allConcurrently('Games Walkthrough', [{ name: 'hoverable-paragraphs', task: hoverableParagraphs }]);
};
