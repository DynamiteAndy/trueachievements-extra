import { required, useFakeTimers } from '@ta-x-test';

import { atOnce } from './slide';
import {
  atEnd,
  copiesOfSlides,
  editAreaBottom,
  headerSliding,
  ownVariable,
  placeEditorAt,
  scroll,
  setUpEditor,
  siteHeader,
  slidTo,
  stickToolbar,
  toolbar,
  variables
} from './stick-under-header.spec-helpers';

// Kept above its end: pinned in its parent once its end comes up, and let go again
describe('page/sticky/stickUnderHeader', () => {
  beforeEach(() => {
    useFakeTimers();
    setUpEditor();
  });

  describe('kept above its end', () => {
    // Stuck: the editor 150px above the window. The toolbar's parent (where it's pinned) starts with it
    const stickIt = async (): Promise<void> => {
      placeEditorAt(-150);
      required(toolbar().parentElement).getBoundingClientRect = () => ({ top: -150 }) as DOMRect;
      await scroll();
    };
    const atEndTop = (): string => ownVariable(variables.atEndTop);

    beforeEach(() => {
      siteHeader();
    });

    test("should pin the stuck element in its parent once its end's bottom reaches it, and let it go after", async () => {
      // Otherwise, nearing the bottom with the header shown, the toolbar would hang over the status bar and below; kept
      // fixed and moved there on each scroll, it would trail the page by a frame
      editAreaBottom(600);
      stickToolbar();
      await stickIt();
      expect(atEnd()).toBe(false);

      // Stuck under the showing header (79px down, 68px tall), the area's bottom 100px down: pinned 182px into its
      // parent, so its bottom is the area's
      editAreaBottom(100);
      await scroll();
      expect(atEnd()).toBe(true);
      expect(atEndTop()).toBe('182px');

      // The header hid, so the fixed element would be at the window's top: it fits again. Pinned, it has no slide of
      // its own: that's told from the header's
      slidTo(-79);
      await scroll();
      expect(atEnd()).toBe(false);

      // Pinned with the header hidden: its bottom is still the area's, without a slide
      editAreaBottom(30);
      await scroll();
      expect(atEnd()).toBe(true);
      expect(atEndTop()).toBe('112px');

      // In place again (the editor back in view): not pinned
      placeEditorAt(200);
      await scroll();
      expect(atEnd()).toBe(false);
    });

    test('should stop its bottom margin short of its end, as in place', async () => {
      // 79px down, 68px tall, a 10px bottom margin: with the area's bottom at 150px it's pinned (147 + 10 is past it)
      toolbar().style.marginBottom = '10px';
      editAreaBottom(150);
      stickToolbar();
      await stickIt();
      expect(atEnd()).toBe(true);
      expect(atEndTop()).toBe('222px');

      editAreaBottom(158);
      await scroll();
      expect(atEnd()).toBe(false);
    });

    test('should keep the gap under the header in where it pins', async () => {
      // 5px under the header (84px down, 68px tall): with the area's bottom at 150px it's pinned
      editAreaBottom(150);
      stickToolbar({ gap: 5 });
      await stickIt();
      expect(atEnd()).toBe(true);

      editAreaBottom(155);
      await scroll();
      expect(atEnd()).toBe(false);
    });

    test('should go back to fixed at once, not slide from where it was pinned', async () => {
      editAreaBottom(100);
      stickToolbar();
      await stickIt();
      expect(atEnd()).toBe(true);

      slidTo(-79);
      await scroll();
      expect(atEnd()).toBe(false);
      expect(toolbar().style.transition).toBe('none');

      vi.advanceTimersToNextFrame();
      expect(toolbar().style.transition).toBe('');
    });

    // Taken away twice in a frame (placed, then fitted to the end), it mustn't come back as its own `none`
    test('should give back the inline transition it had, a frame later', async () => {
      toolbar().style.setProperty('transition', 'opacity 1s');
      editAreaBottom(100);
      stickToolbar();
      await stickIt();
      expect(atEnd()).toBe(true);

      slidTo(-79);
      await scroll();
      atOnce(toolbar());
      expect(toolbar().style.transition).toBe('none');

      vi.advanceTimersToNextFrame();
      expect(toolbar().style.transition).toBe('opacity 1s');
    });

    test('should follow the slide frame by frame while it runs, pinning it where its slide reaches the end', async () => {
      // At the editor's end, the header coming back mustn't move the toolbar at once while it slides: it would jump up
      // and slide back down
      editAreaBottom(100);
      const copy = copiesOfSlides();
      stickToolbar();
      slidTo(-79);
      await stickIt();
      expect(atEnd()).toBe(false);

      // The header shows: its slide starts back from -79px, and the copy with it. Not yet at the area's bottom
      const slide = headerSliding('translateY(-100%)', 'none');
      await scroll();
      expect(copy.animate).toHaveBeenCalledOnce();
      slidTo(-60);
      vi.advanceTimersToNextFrame();
      expect(atEnd()).toBe(false);

      // Its bottom reaches the area's mid-slide: pinned there, without the copy
      slidTo(-40);
      vi.advanceTimersToNextFrame();
      expect(atEnd()).toBe(true);
      expect(atEndTop()).toBe('182px');
      expect(copy.last().cancel).toHaveBeenCalledOnce();

      // Ended: no longer followed
      slide.end();
      await vi.advanceTimersByTimeAsync(0);
      slidTo(-79);
      vi.advanceTimersToNextFrame();
      expect(atEnd()).toBe(true);
    });

    test('should let the pinned element go mid-slide as the header slides up past it, and slide it on from there', async () => {
      // Pinned, it goes by where the header's slide has got, not where it would end, which would let it go late
      editAreaBottom(100);
      const copy = copiesOfSlides();
      stickToolbar();
      await stickIt();
      expect(atEnd()).toBe(true);

      // The header hides: pinned until the fixed element would fit above the area's bottom
      headerSliding('none', 'translateY(-100%)');
      await scroll();
      expect(copy.animate).not.toHaveBeenCalled();
      slidTo(-40);
      vi.advanceTimersToNextFrame();
      expect(atEnd()).toBe(true);

      // Fits (39px down, 68px tall, above the area's 100px): let go, sliding on by a copy of the header's slide
      slidTo(-50);
      vi.advanceTimersToNextFrame();
      expect(atEnd()).toBe(false);
      expect(copy.animate).toHaveBeenCalledOnce();
    });

    test('should pin at the bottom of its container when given no end', async () => {
      stickToolbar({ end: undefined });
      placeEditorAt(-750);
      required(toolbar().parentElement).getBoundingClientRect = () => ({ top: -750 }) as DOMRect;
      await scroll();

      // The container's bottom 50px down: pinned
      expect(atEnd()).toBe(true);
    });
  });
});
