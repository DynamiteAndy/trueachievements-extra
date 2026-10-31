import * as taxPage from '@ta-x-page';
import { settings } from '@ta-x-storage';
import {
  expectAppliesLive,
  find,
  pressKey,
  readFixtureDocument,
  required,
  setHtml,
  setSettings,
  tick
} from '@ta-x-test';

import { improveImageSelector } from './improved-image-selector';
import styles from './styles';

describe('staff/walkthrough/edit-walkthrough-page/improved-image-selector', () => {
  const imageViewer = (): HTMLElement | null => document.querySelector('#oWalkthroughImageViewer');
  const header = (): HTMLElement | null => document.querySelector(`.${styles.improvedImageSelectorContainer}`);
  const titles = (): string[] =>
    [...document.querySelectorAll(`.${styles.improvedImageSelectorImageTitle}`)].map((title) => title.textContent);

  const enable = (): void => {
    setSettings({ 'staff.walkthrough.editWalkthroughPage.improvedImageSelector': true });
  };

  // Runs the feature, stopping it when the test ends: left mounted, its document click and window blur listeners would
  // fire in later tests. Its waits settle in a later task
  const run = async (): Promise<() => void> => {
    const stop = improveImageSelector();
    onTestFinished(stop);
    await tick();
    return stop;
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/image-viewer.html');
  });

  test('should not change anything if the image viewer does not load', async () => {
    enable();
    vi.spyOn(taxPage, 'waitForElement').mockResolvedValueOnce(null);

    await run();

    expect(header()).toBeNull();
    expect(titles()).toEqual([]);
  });

  test('should mark the image viewer', async () => {
    enable();

    await run();

    expect(required(imageViewer()).classList).toContain(styles.improvedImageSelector);
  });

  test('should give the site its own id back once turned off', async () => {
    enable();
    const container = required(imageViewer());
    container.id = ' oWalkthroughImageViewer';
    await run();
    expect(container.id).toBe('oWalkthroughImageViewer');
    expect(container.contains(header())).toBe(true);

    settings.staff.walkthrough.editWalkthroughPage.improvedImageSelector.value = false;
    // An async apply's undo runs once its promise settles
    await tick();

    expect(container.id).toBe(' oWalkthroughImageViewer');
  });

  test('should add a sticky header holding the walkthrough name and add images link', async () => {
    enable();

    await run();

    expect(required(imageViewer()).firstElementChild).toBe(header());
    expect(required(required(header()).nextElementSibling).classList).toContain('imageviewer');
    // Its own sticky class, not the sticky header feature's
    expect(required(header())).toHaveExactClasses([styles.improvedImageSelectorContainer]);
    expect([...required(header()).children].map((child) => child.className || child.tagName)).toEqual([
      'itemname',
      'A'
    ]);
    expect(find('.itemname', header()).textContent).toBe('Asdivine Dios');
    expect(find('a', header()).textContent).toBe('Add images');
    expect(find('.addimages').children).toHaveLength(0);
    expect(document.querySelectorAll(`.${styles.improvedImageSelectorContainer}`)).toHaveLength(1);
  });

  test('should add the image name under each image', async () => {
    enable();

    await run();

    // Last in each image's link (what the title looks like is ImageTitle's own spec)
    expect(
      [...document.querySelectorAll('.ivimage a')].map((anchor) => required(anchor.lastElementChild).textContent)
    ).toEqual(['Credits', 'Forgotten Village', 'Granum Mountain - Missing Chest', 'Yggdrasil Parallel']);
  });

  test('should keep an apostrophe in an image name', async () => {
    // The site quotes the name in single quotes ('<name>' uploaded by …), so the name's own apostrophe isn't an end.
    // None of the captured images has one: the first is renamed here, as the site would write it (its titles carry
    // plain quotes, not entities)
    enable();
    find('.ivimage img').setAttribute('title', "'Boss's Lair' uploaded by Dynamite Andy 29 Sep 22 at 20:11");

    await run();

    expect(titles()[0]).toBe("Boss's Lair");
  });

  test("should show a title the site didn't write as '<name>' uploaded by … as it is", async () => {
    enable();
    find('.ivimage img').setAttribute('title', 'Credits');

    await run();

    expect(titles()[0]).toBe('Credits');
  });

  test('should hide the open image viewer when clicking elsewhere', async () => {
    enable();

    await run();
    required(imageViewer()).style.display = 'block';
    find('.itemname', required(header())).click();

    expect(required(imageViewer()).style.display).toBe('block');

    // An image, and its name under it
    find<HTMLElement>('.ivimage img').click();
    find<HTMLElement>(`.${styles.improvedImageSelectorImageTitle}`).click();

    expect(required(imageViewer()).style.display).toBe('block');

    find<HTMLElement>('.admin-page').click();

    expect(required(imageViewer()).style.display).toBe('none');
  });

  // Our wrench and TinyMCE's Select all are drawn in SVG
  test('should hide the open image viewer when clicking an icon drawn in SVG', async () => {
    enable();
    await run();
    required(imageViewer()).style.display = 'block';
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    find('.admin-page').append(icon);
    onTestFinished(() => icon.remove());

    icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(required(imageViewer()).style.display).toBe('none');
  });

  // From the keyboard: its images are links, so the focus can be in it
  test('should hide the open image viewer on Escape, leaving Escape alone while it is closed', async () => {
    enable();
    await run();

    expect(pressKey(document.body, 'Escape').defaultPrevented).toBe(false);

    required(imageViewer()).style.display = 'block';
    expect(pressKey(find('.ivimage a'), 'Escape').defaultPrevented).toBe(true);
    expect(required(imageViewer()).style.display).toBe('none');
  });

  test('should hide the open image viewer when the focus goes on past it, not while it moves within it', async () => {
    enable();
    await run();
    required(imageViewer()).style.display = 'block';
    const [first, second] = [...document.querySelectorAll<HTMLElement>('.ivimage a')];

    first.focus();
    second.focus();
    expect(required(imageViewer()).style.display).toBe('block');

    // Any control on the page past it (the image viewer's fixture has none of the page's own)
    const outside = document.body.appendChild(document.createElement('button'));
    onTestFinished(() => outside.remove());
    outside.focus();
    expect(required(imageViewer()).style.display).toBe('none');
  });

  test('should hide the open image viewer when the editor takes focus', async () => {
    enable();
    // The site's editor iframe, from the editor's own fixture
    const editor = find<HTMLIFrameElement>(
      '#txtWalkthrough_ifr',
      readFixtureDocument('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-editor.html')
    );
    document.body.append(editor);

    await run();
    required(imageViewer()).style.display = 'block';
    window.dispatchEvent(new Event('blur'));

    expect(required(imageViewer()).style.display).toBe('block');

    vi.spyOn(document, 'activeElement', 'get').mockReturnValue(editor);
    window.dispatchEvent(new Event('blur'));

    expect(required(imageViewer()).style.display).toBe('none');
  });

  test('should apply live: on, off and on again from the menu, off giving the image viewer back exactly', async () => {
    setSettings({ 'staff.walkthrough.editWalkthroughPage.improvedImageSelector': false });
    await run();

    await expectAppliesLive(settings.staff.walkthrough.editWalkthroughPage.improvedImageSelector);
  });

  test('should give the image viewer back as it was once stopped', async () => {
    enable();
    const before = required(imageViewer()).outerHTML;

    const stop = await run();
    stop();
    // An async apply's undo runs once its promise settles
    await tick();

    expect(required(imageViewer()).outerHTML).toBe(before);

    // No longer closed by a click elsewhere
    required(imageViewer()).style.display = 'block';
    find<HTMLElement>('.admin-page').click();

    expect(required(imageViewer()).style.display).toBe('block');
  });

  test('should put the walkthrough name back last in the list once what followed it has gone', async () => {
    enable();
    const stop = await run();
    // The images, and the space that followed the name, taken out while it's mounted, as the site's list refreshing
    // would. Only the Add images holder is left
    const list = find('.imageviewer');
    [...list.childNodes]
      .filter((node) => !(node instanceof Element && node.matches('.addimages')))
      .forEach((node) => node.remove());

    stop();
    await tick();

    expect([...list.children].map((child) => child.className)).toEqual(['addimages', 'itemname']);
    expect(find('.addimages a').textContent).toBe('Add images');
  });
});
