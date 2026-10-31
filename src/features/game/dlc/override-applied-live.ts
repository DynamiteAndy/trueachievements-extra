import { effect } from '@preact/signals';
import { applyLive, settings } from '@ta-x-storage';

const { achievements, dlc } = settings.game;

// The DLC page's override switches individual progress and collapsible groups, both applied live here, and also the
// default status, which applies only on a fresh arrival (isFreshArrival). So it's registered live only while
// neither page's default status is on: then switching it changes nothing that waits for a reload or a new visit, and
// otherwise the settings menu's notice still says so. Returns the stop
export const overrideAppliedLive = (): (() => void) => {
  // The achievements' default status goes unread while the DLC page's own is on, which is fine: either on gives the
  // same answer, and turning the DLC page's off runs this again
  return effect(() =>
    dlc.defaultStatus.value || achievements.defaultStatus.value
      ? undefined
      : applyLive(dlc.overrideAchievementsPageSettings)
  );
};
