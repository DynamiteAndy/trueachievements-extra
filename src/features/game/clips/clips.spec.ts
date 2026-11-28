import { GamesRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { changeToDefaultStatus } from './default-status';

import clips from '.';

describeEntry('game/clips', {
  run: clips,
  page: () => vi.spyOn(GamesRegex.Test, 'clipsUrl'),
  batch: 'Game Clips',
  tasks: [{ name: 'game:clips:change-to-default-status', task: changeToDefaultStatus }]
});
