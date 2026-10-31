import { required, useFakeTimers } from '@ta-x-test';

import {
  container,
  ownVariable,
  placeEditorAt,
  resize,
  scroll,
  setUpEditor,
  siteHeader,
  spacer,
  stickToolbar,
  stickyHelper,
  stuck,
  toolbar,
  variables
} from './stick-under-header.spec-helpers';
import styles from './styles';

// Stuck under the header or in place: when it sticks, the place it holds while stuck, and going back
describe('page/sticky/stickUnderHeader', () => {
  beforeEach(() => {
    useFakeTimers();
    setUpEditor();
  });

  test('should mark the element, and place it under the header on its own, with the gap asked for', async () => {
    stickToolbar({ gap: 5 });

    expect(toolbar().classList).toContain(styles.stickyUnderHeader);
    // The fixture has no site header, so it's given none
    expect(stickyHelper()).toHaveBeenCalledExactlyOnceWith(variables.top, toolbar(), container(), null, {
      paddingFromTop: 5,
      stuck: false
    });

    // Placed again once on each scroll
    await scroll();
    expect(stickyHelper()).toHaveBeenCalledTimes(2);
  });

  describe('stuck or in place', () => {
    test("should stick once the container's top goes under the header (and the gap), not only the window's top", async () => {
      // In place under the header, a gap moving the toolbar down would trail the header and the page, the editor's
      // panel showing grey above it
      const header = siteHeader();
      header.getBoundingClientRect = () => ({ bottom: 79 }) as DOMRect;
      const stop = stickToolbar();

      placeEditorAt(50);
      await scroll();
      expect(stuck()).toBe(true);
      // Told to the sticky helper, which would otherwise take it for in place with the container's top in view
      expect(stickyHelper()).toHaveBeenLastCalledWith(variables.top, toolbar(), container(), header, {
        paddingFromTop: 0,
        stuck: true
      });

      placeEditorAt(100);
      await scroll();
      expect(stuck()).toBe(false);

      // 5px under the header (the page history): stuck from 84px
      stop();
      stickToolbar({ gap: 5 });
      placeEditorAt(84);
      await scroll();
      expect(stuck()).toBe(true);

      // A header scrolled away (not sticky): the window's top
      header.getBoundingClientRect = () => ({ bottom: -50 }) as DOMRect;
      placeEditorAt(10);
      await scroll();
      expect(stuck()).toBe(false);
      placeEditorAt(-10);
      await scroll();
      expect(stuck()).toBe(true);
    });

    test('should keep it stuck to its end, and let it go once the container has left the window', async () => {
      // The site lets the toolbar go before the editor has left the window, and it jumps back to the editor's top
      stickToolbar();

      placeEditorAt(-750);
      await scroll();
      expect(stuck()).toBe(true);

      placeEditorAt(-799);
      await scroll();
      expect(stuck()).toBe(true);

      placeEditorAt(-800);
      await scroll();
      expect(stuck()).toBe(false);
    });

    test('should hold its place with a spacer as tall as it while stuck, and give it back once in place', async () => {
      // Without it the editor is 103px shorter once the toolbar sticks, so near its bottom the toolbar would flip
      // between stuck and in place every frame
      toolbar().getBoundingClientRect = () => ({ top: 399, left: 0, height: 103, width: 1170 }) as DOMRect;
      const parent = required(toolbar().parentElement);
      stickToolbar();

      placeEditorAt(-150);
      await scroll();
      expect(required(spacer()).style.height).toBe('103px');
      // Not in a row: as wide as the parent
      expect(required(spacer()).style.width).toBe('');
      expect(parent.style.position).toBe('relative');

      // Its height followed as it changes (a narrower window wraps the toolbar onto more rows)
      Object.defineProperty(toolbar(), 'offsetHeight', { value: 141, configurable: true });
      resize(toolbar());
      expect(required(spacer()).style.height).toBe('141px');

      placeEditorAt(200);
      await scroll();
      expect(spacer()).toBeNull();
      expect(parent.style.position).toBe('');
    });

    test('should hold the place of an element in a row (a column) as wide as it, as it was laid out', async () => {
      const parent = required(toolbar().parentElement);
      parent.style.display = 'flex';
      toolbar().style.flex = '0 1 auto';
      toolbar().getBoundingClientRect = () => ({ top: 399, left: 0, height: 492, width: 270 }) as DOMRect;
      stickToolbar();

      placeEditorAt(-150);
      await scroll();

      expect(required(spacer()).style.width).toBe('270px');
      expect(required(spacer()).style.flex).toBe('0 1 auto');
    });

    test('should give its place its margins, so what is beside it stays put', async () => {
      // The page history's 10px right margin is the gap to the walkthrough beside it, which would close while
      // it's stuck
      toolbar().style.margin = '0px 10px 10px 0px';
      stickToolbar();

      placeEditorAt(-150);
      await scroll();

      expect(required(spacer()).style.margin).toBe('0px 10px 10px 0px');
    });

    test('should keep the height it had in place while stuck, when asked to', async () => {
      // The page history: its height is its column's share, which fixed would be the window's
      toolbar().getBoundingClientRect = () => ({ top: 399, left: 0, height: 492, width: 270 }) as DOMRect;
      const stop = stickToolbar({ keepHeight: true });
      expect(toolbar().classList).toContain(styles.keepHeight);

      placeEditorAt(-150);
      await scroll();
      expect(ownVariable(variables.height)).toBe('492px');

      placeEditorAt(200);
      await scroll();
      expect(ownVariable(variables.height)).toBe('');

      // Not asked: free to follow its width
      stop();
      expect(toolbar().classList).not.toContain(styles.keepHeight);
      stickToolbar();
      placeEditorAt(-150);
      await scroll();
      expect(ownVariable(variables.height)).toBe('');
    });

    test('should measure its place only once it is stuck, so the page is never laid out between the two', async () => {
      // Measured with its place held and it still in place, the page history's page is laid out shorter, and one
      // scrolled to its end is pulled up by it
      const stuckWhenMeasured: boolean[] = [];
      // On HTMLElement, so Element's own measures the rest
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        if (!this.classList.contains(styles.spacer)) {
          return Element.prototype.getBoundingClientRect.call(this);
        }
        stuckWhenMeasured.push(stuck());
        return { width: 270 } as DOMRect;
      });
      stickToolbar();

      placeEditorAt(-150);
      await scroll();

      expect(stuckWhenMeasured).toEqual([true]);
      expect(ownVariable(variables.width)).toBe('270px');
    });

    test("should be its place's width while stuck, and follow it as that resizes", async () => {
      // With the editor narrowed to 600px, the stuck toolbar mustn't stay 983px, the width it had on load
      stickToolbar();
      placeEditorAt(-150);
      await scroll();
      const place = required(spacer());

      place.getBoundingClientRect = () => ({ width: 600 }) as DOMRect;
      resize(place);
      expect(ownVariable(variables.width)).toBe('600px');

      place.getBoundingClientRect = () => ({ width: 1424 }) as DOMRect;
      resize(place);
      expect(ownVariable(variables.width)).toBe('1424px');

      // In place: no width of its own
      placeEditorAt(200);
      await scroll();
      expect(ownVariable(variables.width)).toBe('');
    });

    test('should decide from where the container is now when it moves without a scroll', async () => {
      // The site fixes the toolbar once the page is scrolled past where the toolbar was on load. Narrowing the window
      // moves the editor down into view (89px), and the site keeps it fixed at the window's top
      stickToolbar();
      placeEditorAt(-150);
      await scroll();

      placeEditorAt(89);
      resize(container());
      await vi.advanceTimersByTimeAsync(0);

      expect(stuck()).toBe(false);
    });

    test('should go back in place at once, not slide from its stuck slide', async () => {
      // Let go, the toolbar would otherwise come down from its stuck slide, 79px above its place
      stickToolbar();
      placeEditorAt(-150);
      await scroll();
      expect(stuck()).toBe(true);
      expect(toolbar().style.transition).toBe('');

      placeEditorAt(200);
      await scroll();
      expect(stuck()).toBe(false);
      expect(toolbar().style.transition).toBe('none');
      vi.advanceTimersToNextFrame();
      expect(toolbar().style.transition).toBe('');
    });
  });
});
