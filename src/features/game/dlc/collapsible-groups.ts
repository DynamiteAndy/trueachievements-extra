import { effectiveSettings, whileSetting } from '@ta-x-storage';

import { applyCollapsibleGroups } from '../shared';

const effective = effectiveSettings.dlc.collapsibleGroups;

// While the effective setting is on (the DLC page's own with its override on, else the achievements page's), live; the
// override itself is registered by override-applied-live.ts, so only the two settings it picks between are here.
// Turned off, the site's rows go back where they were. Returns the stop
export const collapsibleGroups = (): (() => void) =>
  whileSetting([effective.from.own, effective.from.parent], () => effective.value, applyCollapsibleGroups);
