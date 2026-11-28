import { required, useFakeTimers } from '@ta-x-test';

import { slideClasses } from './slide-classes';
import {
  atEnd,
  editAreaBottom,
  followedSizes,
  headerSliding,
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
  transitionEnd,
  variables
} from './stick-under-header.spec-helpers';
import styles from './styles';

// Stopping: the element given back as it was
describe('page/sticky/stickUnderHeader', () => {
  beforeEach(() => {
    useFakeTimers();
    setUpEditor();
  });

  test('should give the element back as it was, and stop following it', async () => {
    const header = siteHeader();
    const onMoved = vi.fn();
    const stop = stickToolbar({ onMoved });
    placeEditorAt(-150);
    required(toolbar().parentElement).getBoundingClientRect = () => ({ top: -150 }) as DOMRect;
    editAreaBottom(100);
    // The header sliding, followed each frame
    headerSliding('none', 'translateY(-100%)');
    await scroll();
    expect([stuck(), atEnd()]).toEqual([true, true]);
    // Its slide class, from the sticky helper
    toolbar().classList.add(slideClasses.yShow);
    // The header resized, its placing a frame away
    resize(header);
    stickyHelper().mockClear();
    onMoved.mockClear();

    stop();
    await scroll();
    transitionEnd(toolbar(), 'transform');
    vi.advanceTimersToNextFrame();
    await vi.advanceTimersByTimeAsync(0);

    expect(toolbar().classList).not.toContain(styles.stickyUnderHeader);
    expect([stuck(), atEnd()]).toEqual([false, false]);
    expect(toolbar().classList).not.toContain(slideClasses.yShow);
    expect(spacer()).toBeNull();
    expect(required(toolbar().parentElement).style.position).toBe('');
    expect([ownVariable(variables.top), ownVariable(variables.atEndTop), ownVariable(variables.width)]).toEqual([
      '',
      '',
      ''
    ]);
    expect(stickyHelper()).not.toHaveBeenCalled();
    expect(onMoved).not.toHaveBeenCalled();
    // Nothing's size followed: the container's, the header's, its own or its place's
    expect(followedSizes()).toBe(0);
  });

  // Its parent is the site's: whatever inline position it had comes back, on letting go and on stopping
  test("should give its parent back the inline position it had, once it's let go or stopped", async () => {
    const parent = required(toolbar().parentElement);
    parent.style.setProperty('position', 'static', 'important');
    const stop = stickToolbar();
    placeEditorAt(-150);
    await scroll();
    expect(stuck()).toBe(true);
    expect(parent.style.position).toBe('relative');

    placeEditorAt(200);
    await scroll();
    expect(stuck()).toBe(false);
    expect([parent.style.getPropertyValue('position'), parent.style.getPropertyPriority('position')]).toEqual([
      'static',
      'important'
    ]);

    placeEditorAt(-150);
    await scroll();
    stop();
    expect([parent.style.getPropertyValue('position'), parent.style.getPropertyPriority('position')]).toEqual([
      'static',
      'important'
    ]);
  });
});
