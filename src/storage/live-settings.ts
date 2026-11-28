import { effect, untracked } from '@preact/signals';
import { logger } from '@ta-x-lib';

import type { Setting } from './setting';

// Settings a feature on this page applies as they change (the skill's writing-specs.md, "Settings that apply live"):
// changing one needs no reload, so the settings menu's notice leaves them out. Counted, as two features can apply the
// same one (the sticky header's Remain Stuck and the elements stuck under it)
const appliedLive = new Map<Setting, number>();

// Registers settings as applied live on this page; returns the one unregister for them all, for the feature's cleanup
// (a second call does nothing)
export const applyLive = (...settings: Setting[]): (() => void) => {
  settings.forEach((setting) => appliedLive.set(setting, (appliedLive.get(setting) ?? 0) + 1));
  let registered = true;

  return () => {
    if (!registered) {
      return;
    }

    registered = false;
    settings.forEach((setting) => {
      const count = (appliedLive.get(setting) ?? 1) - 1;
      if (count > 0) {
        appliedLive.set(setting, count);
      } else {
        appliedLive.delete(setting);
      }
    });
  };
};

export const isAppliedLive = (setting: Setting): boolean => appliedLive.has(setting);

type Cleanup = () => void;

// Applies a feature while its settings say so, and undoes it when they stop saying so, or applies it afresh when a
// value `holds` read changes (a filter's keywords, say): an effect, for a feature that isn't a component (a component
// reads its setting with .value and lets its own effects follow). `holds` reads the settings (or effective settings)
// the feature depends on; `apply` returns what undoes it. An async `apply` gets an abort signal, aborted when it's
// overtaken, and its undo still runs once it resolves. `live` are the settings registered as applied live meanwhile, so
// changing them shows no reload notice. `holds` must read every signal whose change should apply it afresh, each time
// it runs: a read skipped by `&&` isn't tracked, so changing that setting would do nothing. The feature checks its page
// before calling this, so nothing subscribes on pages it doesn't run on. Returns the stop: it undoes the feature and
// unregisters the settings
export const whileSetting = (
  live: readonly Setting[],
  holds: () => boolean,
  apply: (signal: AbortSignal) => Cleanup | void | Promise<Cleanup | void>
): Cleanup => {
  const unregister = applyLive(...live);

  const stop = effect(() => {
    if (!holds()) {
      return undefined;
    }

    const aborted = new AbortController();
    // Reads inside apply aren't tracked: only what `holds` reads re-runs it. A feature failing is logged: thrown, it
    // would leave the effect, and with it the setting's write that ran it (one from another tab would be left unsaved
    // in this one)
    let undo: Cleanup | void | Promise<Cleanup | void> = undefined;
    try {
      undo = untracked(() => apply(aborted.signal));
    } catch (error) {
      logger.error('live-settings', 'applying a setting failed', error);
    }
    const resolvedUndo =
      undo instanceof Promise
        ? undo.catch((error: unknown) => {
            logger.error('live-settings', 'applying a setting failed', error);
            return undefined;
          })
        : undo;

    const runUndo = (cleanup: Cleanup | void): void => {
      try {
        cleanup?.();
      } catch (error) {
        logger.error('live-settings', 'undoing a setting failed', error);
      }
    };

    return () => {
      aborted.abort();
      if (resolvedUndo instanceof Promise) {
        void resolvedUndo.then(runUndo);
      } else {
        runUndo(resolvedUndo);
      }
    };
  });

  return () => {
    stop();
    unregister();
  };
};
