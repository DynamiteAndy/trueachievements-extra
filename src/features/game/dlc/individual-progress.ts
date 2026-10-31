import { effectiveSettings, whileSetting } from '@ta-x-storage';

import { applyIndividualProgress } from '../shared';

const effective = effectiveSettings.dlc.individualProgress;

// While the effective setting is on (the DLC page's own with its override on, else the achievements page's), live; the
// override itself is registered by override-applied-live.ts, as it also switches the default status, so only the two
// settings it picks between are here. Turned off, each header's own text comes back. Returns the stop
export const individualProgress = (): (() => void) =>
  whileSetting([effective.from.own, effective.from.parent], () => effective.value, applyIndividualProgress);
