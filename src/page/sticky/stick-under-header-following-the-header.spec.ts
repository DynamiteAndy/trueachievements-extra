import { required, useFakeTimers } from '@ta-x-test';

import { slideClasses } from './slide-classes';
import {
  copiesOfSlides,
  headerSliding,
  placeEditorAt,
  resize,
  scroll,
  setUpEditor,
  siteHeader,
  stickToolbar,
  stickyHelper,
  stuck,
  toolbar,
  transitionEnd
} from './stick-under-header.spec-helpers';

// Following the header: its slides, its size and its show / hide class, and telling the owner it moved
describe('page/sticky/stickUnderHeader', () => {
  beforeEach(() => {
    useFakeTimers();
    setUpEditor();
  });

  describe('with the header sliding', () => {
    test("should stick mid-slide as the header slides in over the container's top, sliding on with it from there", async () => {
      const header = siteHeader();
      let headerBottom = 0;
      header.getBoundingClientRect = () => ({ bottom: headerBottom }) as DOMRect;
      const copy = copiesOfSlides();
      stickToolbar();

      // In place, the editor 40px down, the header hidden and starting to show
      placeEditorAt(40);
      headerSliding('translateY(-100%)', 'none');
      await scroll();
      expect(stuck()).toBe(false);
      expect(copy.animate).not.toHaveBeenCalled();

      headerBottom = 30;
      vi.advanceTimersToNextFrame();
      await vi.advanceTimersByTimeAsync(0);
      expect(stuck()).toBe(false);

      // The header's bottom passes the editor's top: stuck, sliding by a copy of the header's slide
      headerBottom = 45;
      vi.advanceTimersToNextFrame();
      await vi.advanceTimersByTimeAsync(0);
      expect(stuck()).toBe(true);
      expect(copy.animate).toHaveBeenCalledOnce();
    });

    test("should keep following the header's slide when its own slide ends part-way, and stick as the header passes", async () => {
      // In place, the toolbar's own slide ending mustn't stop the header's being followed: the header would slide in
      // over the editor's top with the toolbar left in place under it
      const header = siteHeader();
      let headerBottom = 0;
      header.getBoundingClientRect = () => ({ bottom: headerBottom }) as DOMRect;
      copiesOfSlides();
      stickToolbar();

      placeEditorAt(30);
      headerSliding('translateY(-100%)', 'none');
      await scroll();
      expect(stuck()).toBe(false);

      transitionEnd(toolbar(), 'transform');
      headerBottom = 50;
      vi.advanceTimersToNextFrame();
      await vi.advanceTimersByTimeAsync(0);

      expect(stuck()).toBe(true);
    });

    test('should decide again where the header has come to rest once its slide ends', async () => {
      const header = siteHeader();
      let headerBottom = 0;
      header.getBoundingClientRect = () => ({ bottom: headerBottom }) as DOMRect;
      copiesOfSlides();
      stickToolbar();

      placeEditorAt(30);
      const slide = headerSliding('translateY(-100%)', 'none');
      await scroll();
      expect(stuck()).toBe(false);

      // Not followed by frames here (none are drawn): only the slide's end can tell
      vi.clearAllTimers();
      headerBottom = 79;
      slide.end();
      await vi.advanceTimersByTimeAsync(0);

      expect(stuck()).toBe(true);
    });

    test("should slide the stuck element by a copy of the header's slide: its moves, timing and start", async () => {
      // Slid by its own transition, the toolbar would fall out of step with the header whenever it started at another
      // time or place (sticking low as the header hid, or turning round mid-slide)
      siteHeader();
      const copy = copiesOfSlides();
      stickToolbar();

      // Turned round mid-way: from 40px up (as computed) back up to the header's height
      const slide = headerSliding('matrix(1, 0, 0, 1, 0, -40)', 'translateY(-100%)');
      placeEditorAt(-150);
      await scroll();
      expect(stuck()).toBe(true);
      expect(copy.animate).toHaveBeenCalledExactlyOnceWith(
        [
          { offset: 0, easing: 'linear', transform: 'translateY(-40px)' },
          { offset: 1, easing: 'linear', transform: 'translateY(-79px)' }
        ],
        { duration: 500, delay: 0, easing: 'ease' }
      );
      expect(copy.last().startTime).toBe(slide.startTime);

      // The same slide: copied once
      await scroll();
      expect(copy.animate).toHaveBeenCalledOnce();

      // Another (the header turned round again): the first copy goes
      const first = copy.last();
      headerSliding('matrix(1, 0, 0, 1, 0, -60)', 'none');
      await scroll();
      expect(first.cancel).toHaveBeenCalledOnce();
      expect(copy.animate).toHaveBeenCalledTimes(2);
      expect(copy.animate.mock.lastCall?.[0]).toEqual([
        { offset: 0, easing: 'linear', transform: 'translateY(-60px)' },
        { offset: 1, easing: 'linear', transform: 'translateY(0px)' }
      ]);

      // In place: no copy
      placeEditorAt(200);
      await scroll();
      expect(copy.last().cancel).toHaveBeenCalledOnce();
    });

    test("should start a copy of a slide just begun with the header's, once that has a start time", async () => {
      // Copied as none, the copy would stand still while the header slid away
      siteHeader();
      const copy = copiesOfSlides();
      stickToolbar();

      const slide = headerSliding('none', 'translateY(-100%)', { begun: false });
      placeEditorAt(-150);
      await scroll();
      expect(copy.animate).toHaveBeenCalledOnce();
      expect(copy.last().startTimes).toEqual([]);

      slide.begin();
      await vi.advanceTimersByTimeAsync(0);
      expect(copy.last().startTime).toBe(slide.startTime);
    });
  });

  describe('the header', () => {
    test('should place it again when the header changes height, a frame later', async () => {
      // Narrowing the window shrinks the header from 79px to 69px (closing its promo bar shrinks it too): the stuck
      // toolbar left 79px down would show the walkthrough between them
      const header = siteHeader();
      stickToolbar();
      stickyHelper().mockClear();

      resize(header);
      await vi.advanceTimersByTimeAsync(0);
      // Not at once: the page below the header hasn't moved yet
      expect(stickyHelper()).not.toHaveBeenCalled();
      vi.advanceTimersToNextFrame();
      await vi.advanceTimersByTimeAsync(0);

      expect(stickyHelper()).toHaveBeenCalledOnce();
    });

    test('should place it again when the header shows or hides, until given back', async () => {
      // The header's class follows a render after the scroll that decided it, so on the last scroll the toolbar would
      // be left pinned under a hidden header
      const header = siteHeader();
      const stop = stickToolbar();
      stickyHelper().mockClear();

      header.classList.add(slideClasses.yHide);
      await vi.advanceTimersByTimeAsync(0);
      expect(stickyHelper()).toHaveBeenCalledOnce();

      stop();
      header.classList.replace(slideClasses.yHide, slideClasses.yShow);
      await vi.advanceTimersByTimeAsync(0);
      expect(stickyHelper()).toHaveBeenCalledOnce();
    });
  });

  test('should tell its owner after a scroll, and when its slide ends', async () => {
    const onMoved = vi.fn();
    stickToolbar({ onMoved });

    await scroll();
    expect(onMoved).toHaveBeenLastCalledWith('scroll');

    transitionEnd(toolbar(), 'opacity');
    expect(onMoved).toHaveBeenCalledOnce();
    transitionEnd(toolbar(), 'transform');
    expect(onMoved).toHaveBeenLastCalledWith('slide-end');
  });

  test("should take no transform ending inside it for its own slide's", async () => {
    const onMoved = vi.fn();
    stickToolbar({ onMoved });
    await scroll();
    onMoved.mockClear();
    const child = required(toolbar().firstElementChild);

    child.dispatchEvent(Object.assign(new Event('transitionend', { bubbles: true }), { propertyName: 'transform' }));

    expect(onMoved).not.toHaveBeenCalled();
  });

  test("should tell its owner each frame of the header's slide, as it moves with it", async () => {
    siteHeader();
    copiesOfSlides();
    const onMoved = vi.fn();
    stickToolbar({ onMoved });
    placeEditorAt(-150);
    headerSliding('translateY(-100%)', 'none');
    await scroll();
    onMoved.mockClear();

    vi.advanceTimersToNextFrame();
    vi.advanceTimersToNextFrame();

    expect(onMoved.mock.calls).toEqual([['slide'], ['slide']]);
  });
});
