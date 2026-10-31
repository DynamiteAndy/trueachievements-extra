import { GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import hoverableParagraphs from './hoverable-paragraphs';

import walkthrough from '.';

describeEntry('game/walkthrough', {
  run: walkthrough,
  page: () => vi.spyOn(GamesRegex.Test, 'walkthroughUrl'),
  batch: 'Game Walkthrough',
  tasks: [{ name: 'game:walkthrough:hoverable-paragraphs', task: hoverableParagraphs }]
});
