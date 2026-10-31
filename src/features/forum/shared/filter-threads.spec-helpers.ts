import { isAppliedLive, settings, type Setting } from '@ta-x-storage';
import { expectAppliesLive, hiddenThreads, setHtml, setSettings, tick } from '@ta-x-test';

// For the specs of the gates in front of the shared thread filter (my threads, view board, a game's forum). Each gate
// runs on the my threads fixture, whose two threads are hidden by "free content" and "unobtainables" respectively.
type GateRow = { name: string; settings: Record<string, unknown>; expected: string[] };

export const describeThreadFilterGate = (
  name: string,
  {
    run,
    live,
    settings: gateSettings = {},
    rows
  }: {
    // The gate: starts filtering live, returning its stop
    run: () => () => void;
    // Every setting its effective filter and keywords come from, each needing no reload (none of the others)
    live: Setting[];
    // What every row sets besides the forum's keywords ("free content"), e.g. the gate's own keywords
    settings?: Record<string, unknown>;
    // Each row's own settings, and the threads hidden then (`hiddenThreads()`)
    rows: GateRow[];
  }
): void => {
  describe(name, () => {
    const { forum } = settings;
    // Starts the gate, stopping it when the test ends, and lets the parsed page's filtering finish
    const start = async (): Promise<void> => {
      onTestFinished(run());
      await tick();
    };

    beforeEach(() => {
      setHtml('@ta-x-test-views/forum-thread-list/my-threads.html');
    });

    test.each(rows)('$name', async ({ settings: rowSettings, expected }) => {
      setSettings({ 'forum.threadFilterKeywords': ['free content'], ...gateSettings, ...rowSettings });

      await start();

      expect(hiddenThreads()).toEqual(expected);
      // Nothing more hidden a little later either
      await tick();
      expect(hiddenThreads()).toEqual(expected);
    });

    // Live: with its override off, the forum's filter decides
    test('should apply live: the filter on, off and on again from the menu, off giving every thread back', async () => {
      setSettings({
        'forum.threadFilter': false,
        'forum.threadFilterKeywords': ['free content']
      });
      await start();

      await expectAppliesLive(forum.threadFilter);
    });

    test('should apply each setting its filter and keywords come from live, while running only', async () => {
      const stop = run();

      expect(live.map(isAppliedLive)).toEqual(live.map(() => true));

      stop();

      expect(live.map(isAppliedLive)).toEqual(live.map(() => false));
    });
  });
};
