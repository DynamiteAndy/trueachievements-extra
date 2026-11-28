import { find, setHtml, stillParsing, tick, useFakeTimers } from '@ta-x-test';

import { waitForSideColumnSlot } from './side-column-slot';

const removeFullSections = (): void =>
  find('.main aside')
    .querySelectorAll('section:not(.smallpanel)')
    .forEach((section) => section.remove());

describe('waitForSideColumnSlot', () => {
  test("should give the side column and its first section that isn't a small panel", async () => {
    setHtml('@ta-x-test-views/forum-thread/mirrors-edge-walkthrough.html');

    const slot = await waitForSideColumnSlot();

    expect(slot?.parent).toBe(find('.main aside'));
    expect(slot?.before).toBe(find('.main aside > section.red'));
  });

  test('should give null on a page without a side column, once the wait times out', async () => {
    useFakeTimers();
    setHtml('@ta-x-test-views/forum-thread/mirrors-edge-walkthrough.html');
    find('.main aside').remove();

    const slot = waitForSideColumnSlot();
    await vi.advanceTimersByTimeAsync(10_000);

    expect(await slot).toBeNull();
  });

  test('should go last at once on a parsed page whose side column has only small panels', async () => {
    useFakeTimers();
    setHtml('@ta-x-test-views/forum-thread/mirrors-edge-walkthrough.html');
    removeFullSections();

    const slot = waitForSideColumnSlot();
    await vi.advanceTimersByTimeAsync(0);

    expect(await slot).toEqual({ parent: find('.main aside'), before: null });
  });

  test('should give a full section the parser adds to the side column before the page is parsed', async () => {
    setHtml('@ta-x-test-views/forum-thread/mirrors-edge-walkthrough.html');
    const aside = find('.main aside');
    const sections = [...aside.querySelectorAll('section:not(.smallpanel)')];
    removeFullSections();
    const finishParsing = stillParsing();

    const slot = waitForSideColumnSlot();
    await tick();
    aside.append(...sections);
    await tick();
    finishParsing();

    expect((await slot)?.before).toBe(sections[0]);
  });

  test('should go last once the page is parsed without a full section', async () => {
    setHtml('@ta-x-test-views/forum-thread/mirrors-edge-walkthrough.html');
    removeFullSections();
    const finishParsing = stillParsing();

    const slot = waitForSideColumnSlot();
    await tick();
    finishParsing();

    expect(await slot).toEqual({ parent: find('.main aside'), before: null });
  });

  test('should give null once aborted while waiting for the first full section', async () => {
    setHtml('@ta-x-test-views/forum-thread/mirrors-edge-walkthrough.html');
    removeFullSections();
    stillParsing();
    const stopped = new AbortController();

    const slot = waitForSideColumnSlot(stopped.signal);
    // Once it's waiting for the section
    await tick();
    stopped.abort();

    expect(await slot).toBeNull();
  });

  // With no full section yet and the page still parsing, only giving up straight away settles it
  test('should give null when already aborted', async () => {
    setHtml('@ta-x-test-views/forum-thread/mirrors-edge-walkthrough.html');
    removeFullSections();
    stillParsing();
    const stopped = new AbortController();
    stopped.abort();

    expect(await waitForSideColumnSlot(stopped.signal)).toBeNull();
  });
});
