import * as taxLib from '@ta-x-lib';

import type { MockInstance } from 'vitest';

import { setHtml, stillParsing, withoutBody } from './document';
import { tick } from './timers';

interface EntrySpec {
  // Runs the entry
  run: () => Promise<unknown>;
  // Spies on the page check that gates it, e.g. () => vi.spyOn(GamesRegex.Test, 'clipsUrl'); none for an entry that
  // runs on every page
  page?: () => MockInstance<() => boolean>;
  // The batch it starts on its page, exactly
  batch: string;
  tasks: taxLib.TaskDefinition<unknown>[];
  // A step before the batch that can reload the page (picking a default status or tab), mocked to resolve false;
  // when it resolves true the batch is left to the page it loads
  postsBack?: MockInstance<() => Promise<boolean>>;
  // Whether the batch waits for the page to be parsed (its tasks read whole lists)
  parsed?: boolean;
  // Classes it adds to <body> beside the batch, not before it
  bodyClasses?: string[];
}

// The checks every feature entry point shares: nothing off its page, exactly its batch on it, and, where it has them,
// the post-back, the wait for the parse and the body classes. The batch is stubbed, as each task has its own spec
export const describeEntry = (name: string, spec: EntrySpec): void => {
  describe(name, () => {
    const batch = (): MockInstance => vi.spyOn(taxLib, 'allConcurrently').mockResolvedValue([]);
    const marked = (): boolean[] =>
      (spec.bodyClasses ?? []).map((bodyClass) => document.body.classList.contains(bodyClass));

    // On its page; an entry without a page check runs on every page
    const onPage = (): void => {
      spec.page?.().mockReturnValue(true);
    };

    beforeEach(() => {
      setHtml('@ta-x-test-views/empty.html');
    });

    if (spec.page) {
      const page = spec.page;

      test('does nothing off its page', async () => {
        page().mockReturnValue(false);
        const spy = batch();

        await spec.run();

        expect(spy).not.toHaveBeenCalled();
        expect(marked().filter(Boolean)).toEqual([]);
      });
    }

    test('starts exactly its batch on its page', async () => {
      onPage();
      const spy = batch();

      await spec.run();

      expect(spy).toHaveBeenCalledExactlyOnceWith(spec.batch, spec.tasks);
      expect(marked()).toEqual(spec.bodyClasses?.map(() => true) ?? []);
    });

    // So the group above it logs the feature as finished only once its work has, and its timings mean something
    test('resolves only once its batch has finished', async () => {
      onPage();
      const { promise, resolve: finish } = Promise.withResolvers<unknown[]>();
      const spy = vi.spyOn(taxLib, 'allConcurrently').mockReturnValue(promise);
      let resolved = false;

      const running = spec.run().then(() => {
        resolved = true;
      });
      await vi.waitFor(() => expect(spy).toHaveBeenCalledOnce());
      await tick();

      expect(resolved).toBe(false);

      finish([]);
      await running;

      expect(resolved).toBe(true);
    });

    if (spec.postsBack) {
      const postsBack = spec.postsBack;

      test('leaves its batch to the page its post-back loads', async () => {
        onPage();
        postsBack.mockResolvedValueOnce(true);
        const spy = batch();

        await spec.run();

        expect(spy).not.toHaveBeenCalled();
      });
    }

    if (spec.parsed) {
      // A long list can still be parsing when the tasks could start
      test('starts its batch only once the page is parsed', async () => {
        onPage();
        const finishParsing = stillParsing();
        const spy = batch();

        const running = spec.run();
        await tick();

        expect(spy).not.toHaveBeenCalled();

        finishParsing();
        await running;

        expect(spy).toHaveBeenCalledOnce();
      });
    }

    if (spec.bodyClasses) {
      test('starts its batch before the page has a body, and marks the body once it has one', async () => {
        onPage();
        const spy = batch();
        const addBody = withoutBody();

        const running = spec.run();
        await tick();

        expect(spy).toHaveBeenCalledOnce();

        addBody();
        await running;

        expect(marked()).toEqual(spec.bodyClasses?.map(() => true) ?? []);
      });
    }
  });
};
