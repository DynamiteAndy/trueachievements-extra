import { GamerRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { addGroupByGameButton } from './add-group-by-game-button';

import achievements from '.';

describeEntry('gamer/achievements', {
  run: achievements,
  page: () => vi.spyOn(GamerRegex.Test, 'gamerAchievementsUrl'),
  batch: 'Gamer Achievements',
  tasks: [{ name: 'gamer:achievements:add-group-by-game-button', task: addGroupByGameButton }]
});
