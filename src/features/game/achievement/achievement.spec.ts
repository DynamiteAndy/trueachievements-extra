import { AchievementsRegex } from '@ta-x-site';
import { describeEntry } from '@ta-x-test';

import { importGuides } from '../extra-guides';

import achievement from '.';

describeEntry('game/achievement', {
  run: achievement,
  page: () => vi.spyOn(AchievementsRegex.Test, 'achievementUrl'),
  batch: 'Game Achievement',
  tasks: [{ name: 'game:achievement:extra-guides', task: importGuides }]
});
