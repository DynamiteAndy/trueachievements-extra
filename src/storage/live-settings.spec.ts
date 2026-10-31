import { signal } from '@preact/signals';
import { logger } from '@ta-x-lib';

import { applyLive, isAppliedLive, whileSetting } from './live-settings';
import { settings } from './settings-tree';

describe('storage/live-settings', () => {
  const { emojis } = settings.allPages;
  const { hoverableParagraphs } = settings.game.walkthrough;

  describe('applyLive', () => {
    test('registers a setting until its unregister runs', () => {
      const unregister = applyLive(emojis);
      expect(isAppliedLive(emojis)).toBe(true);

      unregister();
      expect(isAppliedLive(emojis)).toBe(false);
    });

    test('keeps a setting registered while another feature still applies it, and counts each unregister once', () => {
      const first = applyLive(emojis);
      const second = applyLive(emojis);

      first();
      first();
      expect(isAppliedLive(emojis)).toBe(true);

      second();
      expect(isAppliedLive(emojis)).toBe(false);
    });

    test('registers several settings at once, with one unregister for them all that counts once', () => {
      const other = applyLive(emojis);
      const both = applyLive(emojis, hoverableParagraphs);
      expect([isAppliedLive(emojis), isAppliedLive(hoverableParagraphs)]).toEqual([true, true]);

      both();
      both();
      expect([isAppliedLive(emojis), isAppliedLive(hoverableParagraphs)]).toEqual([true, false]);

      other();
      expect(isAppliedLive(emojis)).toBe(false);
    });
  });

  describe('whileSetting', () => {
    test('applies while its setting is on, undoes it when turned off, and applies again when turned back on', () => {
      emojis.value = false;
      const calls: string[] = [];
      const stop = whileSetting(
        [emojis],
        () => emojis.value,
        () => {
          calls.push('apply');
          return () => calls.push('undo');
        }
      );
      onTestFinished(stop);

      expect(calls).toEqual([]);
      emojis.value = true;
      expect(calls).toEqual(['apply']);
      emojis.value = false;
      expect(calls).toEqual(['apply', 'undo']);
      emojis.value = true;
      expect(calls).toEqual(['apply', 'undo', 'apply']);
    });

    test('applies afresh when a value its condition read changes, undoing the run before', () => {
      const keywords = signal(['one']);
      const applied: string[][] = [];
      const undone: string[][] = [];
      const stop = whileSetting(
        [],
        () => keywords.value.length > 0,
        () => {
          const these = keywords.peek();
          applied.push(these);
          return () => undone.push(these);
        }
      );
      onTestFinished(stop);

      keywords.value = ['one', 'two'];

      expect(applied).toEqual([['one'], ['one', 'two']]);
      expect(undone).toEqual([['one']]);
    });

    test("doesn't re-run for a signal only its apply read", () => {
      const other = signal(1);
      const apply = vi.fn(() => {
        expect(other.value).toBe(1);
      });
      emojis.value = true;
      const stop = whileSetting([], () => emojis.value, apply);
      onTestFinished(stop);

      other.value = 2;

      expect(apply).toHaveBeenCalledOnce();
    });

    test('aborts an async run that was overtaken, and still undoes it once it resolves', async () => {
      emojis.value = true;
      let finish = (): void => undefined;
      const signals: AbortSignal[] = [];
      const undo = vi.fn();
      const stop = whileSetting(
        [],
        () => emojis.value,
        (aborted) => {
          signals.push(aborted);
          return new Promise<() => void>((resolve) => {
            finish = () => resolve(undo);
          });
        }
      );
      onTestFinished(stop);

      emojis.value = false;
      expect(signals[0].aborted).toBe(true);
      expect(undo).not.toHaveBeenCalled();

      finish();
      await vi.waitFor(() => expect(undo).toHaveBeenCalledOnce());
    });

    test('registers its settings as applied live until stopped, and stopping undoes the feature', () => {
      emojis.value = true;
      const undo = vi.fn();
      const stop = whileSetting(
        [emojis, hoverableParagraphs],
        () => emojis.value,
        () => undo
      );

      expect([isAppliedLive(emojis), isAppliedLive(hoverableParagraphs)]).toEqual([true, true]);

      stop();

      expect(undo).toHaveBeenCalledOnce();
      expect([isAppliedLive(emojis), isAppliedLive(hoverableParagraphs)]).toEqual([false, false]);
    });

    // Thrown, it would leave the effect, and with it the setting's write that ran it
    describe('a feature failing', () => {
      test('logs an apply that throws, and the setting change that ran it still completes', () => {
        emojis.value = false;
        const logError = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
        const stop = whileSetting(
          [],
          () => emojis.value,
          () => {
            throw new Error('apply');
          }
        );
        onTestFinished(stop);

        expect(() => {
          emojis.value = true;
        }).not.toThrow();
        expect(emojis.peek()).toBe(true);
        expect(logError).toHaveBeenCalledExactlyOnceWith(
          'live-settings',
          'applying a setting failed',
          expect.any(Error)
        );
      });

      test('logs an async apply that rejects', async () => {
        emojis.value = true;
        const logError = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
        const stop = whileSetting(
          [],
          () => emojis.value,
          () => Promise.reject(new Error('fetch'))
        );
        onTestFinished(stop);

        await vi.waitFor(() =>
          expect(logError).toHaveBeenCalledExactlyOnceWith(
            'live-settings',
            'applying a setting failed',
            expect.any(Error)
          )
        );
      });

      test('logs an undo that throws, and the setting change that ran it still completes', () => {
        emojis.value = true;
        const logError = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
        const stop = whileSetting(
          [],
          () => emojis.value,
          () => () => {
            throw new Error('undo');
          }
        );
        onTestFinished(stop);

        expect(() => {
          emojis.value = false;
        }).not.toThrow();
        expect(logError).toHaveBeenCalledExactlyOnceWith(
          'live-settings',
          'undoing a setting failed',
          expect.any(Error)
        );
      });
    });
  });
});
