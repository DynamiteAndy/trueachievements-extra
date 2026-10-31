import { logger } from '@ta-x-lib';
import { required } from '@ta-x-test';
import * as taxUi from '@ta-x-ui';
import { render } from 'preact';

import { claimPage, isDevScript, runningAttribute, warnDevStoodDown } from './claim-page';

describe('claim-page', () => {
  const release =
    'https://github.com/DynamiteAndy/trueachievements-extra/releases/latest/download/trueachievements-extras.user.js';
  const releaseMin =
    'https://github.com/DynamiteAndy/trueachievements-extra/releases/latest/download/trueachievements-extras.min.user.js';
  const copies = {
    dev: { name: 'TrueAchievements Extra - Development', downloadURL: null },
    release: { name: 'TrueAchievements Extra', downloadURL: release },
    releaseMin: { name: 'TrueAchievements Extra', downloadURL: releaseMin }
  };

  // Runs as one of the three scripts, for this test
  const runAs = (copy: keyof typeof copies): void => {
    const { script } = GM_info;
    (GM_info as { script: unknown }).script = copies[copy];
    onTestFinished(() => {
      (GM_info as { script: unknown }).script = script;
    });
  };

  const running = (): string | null => document.documentElement.getAttribute(runningAttribute);

  // Each test is a new page load, with no copy running yet
  beforeEach(() => {
    document.documentElement.removeAttribute(runningAttribute);
  });

  test.each([
    { copy: 'dev', named: 'trueachievements-extras.dev.user.js' },
    { copy: 'release', named: 'trueachievements-extras.user.js' },
    { copy: 'releaseMin', named: 'trueachievements-extras.min.user.js' }
  ] as const)('should run the first copy on the page, marking it as $named', ({ copy, named }) => {
    runAs(copy);

    expect(claimPage()).toBe(true);
    expect(running()).toBe(named);
  });

  test('should mark the page with the name of a release script with no download address', () => {
    expect(claimPage()).toBe(true);
    expect(running()).toBe('TrueAchievements Extra');
  });

  // Any pair: dev and a release script, or both release scripts
  test.each([
    { first: 'dev', second: 'release' },
    { first: 'release', second: 'dev' },
    { first: 'release', second: 'releaseMin' },
    { first: 'releaseMin', second: 'release' }
  ] as const)(
    'should stand a later copy down ($first, then $second), keeping the first one marked',
    ({ first, second }) => {
      const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
      runAs(first);
      claimPage();
      const marked = running();

      runAs(second);

      expect(claimPage()).toBe(false);
      expect(running()).toBe(marked);
      expect(warn).toHaveBeenCalledOnce();
    }
  );

  test.each([
    { copy: 'dev', dev: true },
    { copy: 'release', dev: false },
    { copy: 'releaseMin', dev: false }
  ] as const)('should tell the dev script from the release scripts ($copy)', ({ copy, dev }) => {
    runAs(copy);

    expect(isDevScript()).toBe(dev);
  });

  test('should tell the developer, in a toast, which copy is running instead of the dev build', async () => {
    runAs('releaseMin');
    claimPage();
    // Its own sheet, as the copy running may be an older build
    const stylesheet = vi.spyOn(taxUi, 'stylesheet').mockResolvedValue();

    await warnDevStoodDown();

    expect(taxUi.toastMessage.value).toMatchObject({ type: 'danger' });
    const text = document.createElement('div');
    render(required(taxUi.toastMessage.value).text, text);
    expect(text.textContent).toBe(
      "This dev build isn't running: trueachievements-extras.min.user.js started first. Disable it, or move the dev script above it in Tampermonkey."
    );
    expect(stylesheet).toHaveBeenCalledOnce();
    expect(document.querySelector('.jq-toast-wrap')).not.toBeNull();
  });
});
