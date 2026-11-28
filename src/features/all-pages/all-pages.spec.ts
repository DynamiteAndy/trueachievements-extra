import { describeEntry } from '@ta-x-test';

import emojis from './emojis';
import giveawayAutoOptIn from './giveaway-auto-opt-in';
import stickyHeader from './sticky-header';

import allPages from '.';

// On every page: each feature checks its own setting and page
describeEntry('all-pages', {
  run: allPages,
  batch: 'All Pages',
  tasks: [
    { name: 'all-pages:sticky-header', task: stickyHeader },
    { name: 'all-pages:emojis', task: emojis },
    { name: 'all-pages:giveaway-auto-opt-in', task: giveawayAutoOptIn }
  ]
});
