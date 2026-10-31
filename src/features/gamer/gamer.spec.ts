import { GamerRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import achievements from './achievements';

import gamer from '.';

describeEntry('gamer', {
  run: gamer,
  page: () => vi.spyOn(GamerRegex.Test, 'all'),
  batch: 'Gamer',
  tasks: [{ name: 'gamer:achievements', task: achievements }]
});
