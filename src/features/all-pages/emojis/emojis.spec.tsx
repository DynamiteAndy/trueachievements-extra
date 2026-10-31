import { faFaceSmile } from '@fortawesome/free-regular-svg-icons/faFaceSmile';
import { mutationObserver, pageScript } from '@ta-x-page';
import { settings } from '@ta-x-storage';
import {
  changeSettingLive,
  expectAppliesLive,
  find,
  readFixtureDocument,
  required,
  setHtml,
  setSettings,
  stillParsing,
  tick,
  withoutUniqueIds
} from '@ta-x-test';
import { hideClass, TabsStyles } from '@ta-x-ui';
import { act } from 'preact/test-utils';

import type { Mock } from 'vitest';

import { defineDropdownToggle } from './dropdown-toggle';
import styles from './styles';

import emojis from '.';

describe('emojis', () => {
  beforeEach(() => {
    // The toggle script goes in <head>, which setHtml doesn't reset
    document.querySelectorAll('script#ta-x-emojis-dropdown-toggle').forEach((script) => script.remove());
    setHtml('@ta-x-test-views/empty.html');
  });

  const pickers = (): Element[] => [...document.querySelectorAll(`.${styles.jsEmojis}`)];
  const toggleScripts = (): Element[] => [...document.querySelectorAll('script#ta-x-emojis-dropdown-toggle')];
  // The thread's quick reply box, off the page, for a test to add as the site or the parser does
  const quickReplyBox = (): HTMLElement =>
    find('#aeb_txtQuickReply', readFixtureDocument('@ta-x-test-views/forum-thread/quick-reply-box.html'));
  // Runs it, stopping it when the test ends
  const run = async (): Promise<void> => {
    onTestFinished(emojis());
    await act(() => tick());
  };

  test('should add nothing to the page if enabled and no emoji container is found', async () => {
    setSettings({ 'allPages.emojis': true });

    await run();

    expect(pickers()).toHaveLength(0);
    expect(toggleScripts()).toHaveLength(0);
  });

  test.each([
    ['#aeb_txtQuickReply', '@ta-x-test-views/forum-thread/quick-reply-box.html'],
    ['#aeb_txtQuickReply', '@ta-x-test-views/news-article/quick-reply-box.html'],
    ['#aeb_aebMessageBody', '@ta-x-test-views/forum-add-post/reply-box.html'],
    ['#aeb_aebMessage', '@ta-x-test-views/direct-message/reply-box.html'],
    ['#aeb_aebComment', '@ta-x-test-views/add-guide-page/reply-box.html'],
    ['#aeb_txtAddSubComment', '@ta-x-test-views/achievement-guide/comment-box.html']
  ])('should add a picker to %s (%s), and the dropdown toggle script once', async (box: string, view: string) => {
    setHtml(view);
    setSettings({ 'allPages.emojis': true });

    await run();

    expect(pickers()).toHaveLength(1);
    expect(find(box).contains(pickers()[0])).toBe(true);
    // In the page, for the picker's button: some site pages don't define DropdownButtonPanel_Toggle
    expect(toggleScripts()).toHaveLength(1);
    expect(toggleScripts()[0].textContent).toBe(pageScript(defineDropdownToggle));
  });

  describe('a reply box added after the page has loaded (the site adds some with its own scripts)', () => {
    // The quick reply box's markup, added to an empty page once emojis has started
    const addReplyBox = async (): Promise<void> => {
      await act(() => {
        document.body.append(quickReplyBox());
      });
    };

    beforeEach(() => {
      // No box on the page to start with
      setSettings({ 'allPages.emojis': true });
    });

    test("should get the dropdown toggle script too, as the page may not define the site's", async () => {
      await run();
      await addReplyBox();

      await vi.waitFor(() => expect(pickers()).toHaveLength(1));
      expect(toggleScripts()).toHaveLength(1);
    });

    test('should not add the script again on a page that already has it', async () => {
      setHtml('@ta-x-test-views/forum-add-post/reply-box.html');
      await run();
      await addReplyBox();

      await vi.waitFor(() => expect(pickers()).toHaveLength(2));
      expect(toggleScripts()).toHaveLength(1);
    });

    test('should add one picker to a box put back before its toolbar arrives', async () => {
      const box = quickReplyBox();
      const toolbar = find('.toolbar', box);
      const toolbarParent = required(toolbar.parentElement);
      toolbar.remove();
      await run();

      // Both sightings wait for the same toolbar
      await act(() => {
        document.body.append(box);
      });
      await act(() => {
        box.remove();
        document.body.append(box);
      });
      await act(() => {
        toolbarParent.append(toolbar);
      });

      await vi.waitFor(() => expect(pickers()).toHaveLength(1));
      await act(() => tick());
      expect(pickers()).toHaveLength(1);
    });
  });

  describe('applied live', () => {
    const addReplyBox = async (): Promise<void> => {
      await act(() => {
        document.body.append(quickReplyBox());
      });
      await act(() => tick());
    };

    test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
      setHtml('@ta-x-test-views/forum-thread/quick-reply-box.html');
      setSettings({ 'allPages.emojis': false });
      await run();

      // On again is a new picker, with tab ids of its own
      await expectAppliesLive(settings.allPages.emojis, () => withoutUniqueIds(document.body.innerHTML));
    });

    test('should take out the pickers of boxes added later too, and stop watching for new ones', async () => {
      // Each watch's stop, to see it's called: a watch left running adds no picker (the off aborts it), so the page
      // alone doesn't show it
      const stops: Mock<() => void>[] = [];
      const onElementAdded = mutationObserver.onElementAdded.bind(mutationObserver);
      vi.spyOn(mutationObserver, 'onElementAdded').mockImplementation((...args) => {
        const stop = vi.fn(onElementAdded(...args));
        stops.push(stop);
        return stop;
      });
      setSettings({ 'allPages.emojis': true });
      await run();
      await addReplyBox();
      expect(pickers()).toHaveLength(1);

      await changeSettingLive(settings.allPages.emojis, false);
      expect(pickers()).toHaveLength(0);
      expect(stops).toHaveLength(1);
      expect(stops[0]).toHaveBeenCalledExactlyOnceWith();

      await addReplyBox();
      expect(pickers()).toHaveLength(0);
    });
  });

  describe('emoji tabs', () => {
    // An element's tag and attributes (in any order) with its children, to compare with the site's markup
    const describeElement = (element: Element): unknown => ({
      [element.tagName.toLowerCase()]: Object.fromEntries(
        [...element.attributes].map(({ name, value }) => [name, value])
      ),
      children: [...element.children].map(describeElement)
    });
    // The site's own smiley and controller items: a focusable span inserting its code, holding its image; ours are
    // buttons to a screen reader too (role="button", taking Enter and Space)
    const siteItem = (code: string, img: Record<string, string>) => ({
      span: {
        onclick: `InsertAtCursor('txtQuickReply','${code}', '${styles.jsEmojiDropdown}'); return false;`,
        tabindex: '0',
        role: 'button'
      },
      children: [{ img, children: [] }]
    });

    const openQuickReply = async (): Promise<HTMLElement> => {
      setHtml('@ta-x-test-views/forum-thread/quick-reply-box.html');
      setSettings({ 'allPages.emojis': true });

      await run();

      return find(`#aeb_txtQuickReply .toolbar .formatbuttons:last-child .${styles.jsEmojis}`);
    };

    test('should add a tab link and tab content for each emoji group', async () => {
      const picker = await openQuickReply();
      const links = [...picker.querySelectorAll<HTMLElement>(`.${TabsStyles.tabsLinkContainer} > li`)];
      const contents = [...picker.querySelectorAll<HTMLElement>(`.${styles.jsEmojiDropdown} > div`)];

      // The site's two, then emoji.json's ten groups (their names and order are EmojiPicker.spec's)
      expect(links).toHaveLength(12);
      expect(contents).toHaveLength(12);
      links.forEach((link, index) => {
        expect(link).toHaveExactClasses(
          index === 0 ? [TabsStyles.tabsLink, TabsStyles.tabSelected] : [TabsStyles.tabsLink]
        );
        expect(link.getAttribute('aria-controls')).toBe(contents[index].id);
        expect(contents[index].className).toBe(TabsStyles.tabsContent);
        expect(contents[index].id).toMatch(
          new RegExp(`^ta-x-tabs-group-\\d+-${link.textContent.replace(/[^A-Z0-9]/gi, '').toLowerCase()}$`)
        );
      });
    });

    test("should add the picker's button and hidden panel, opened by the site's dropdown toggle", async () => {
      const picker = await openQuickReply();
      const button = find('a', picker);
      const panel = find<HTMLElement>(`.${styles.jsEmojiDropdown}`, picker);

      // Their classes, the toggle and the panel's starting hidden are EmojiPicker's (its spec checks them)
      expect([...picker.children]).toEqual([button, panel]);
      expect(button.getAttribute('title')).toBe('Insert TaX Emoji');
      expect(button.getAttribute('href')).toBe('#');
      expect(find('svg path', button).getAttribute('d')).toBe(faFaceSmile.icon[4]);
      expect(required(panel.firstElementChild).className).toBe(TabsStyles.tabsLinkContainer);
    });

    test("should fill the TrueAchievements tab with the site's smileys, in the site's markup", async () => {
      const picker = await openQuickReply();
      const smileys = [...picker.querySelectorAll('[role="tabpanel"][id$="-trueachievements"] > span')];

      expect(smileys.slice(0, 2).map(describeElement)).toEqual([
        siteItem('[smile]', { src: '/images/smiley/smile.gif', alt: 'smile', width: '15', height: '15' }),
        siteItem('[laugh]', { src: '/images/smiley/laugh.gif', alt: 'laugh', width: '15', height: '15' })
      ]);
      expect(find('img', smileys.at(-1)).getAttribute('src')).toBe('/images/smiley/rock.gif');
    });

    test("should fill the Controller tab with the site's controller buttons, in the site's markup", async () => {
      const picker = await openQuickReply();
      const buttons = [...picker.querySelectorAll('[role="tabpanel"][id$="-controller"] > span')];

      expect(describeElement(buttons[0])).toEqual(
        siteItem('[cn_A]', {
          src: '/images/controllerbuttons/Xbox%20One/cn_A.png',
          alt: 'cn_A',
          width: '18',
          height: '18'
        })
      );
      expect(find('img', buttons.at(-1)).getAttribute('alt')).toBe('cn_guide');
    });

    // The site's own buttons, each the toolbar div holding it
    const siteButtons = (): Element[] =>
      [
        ...document.querySelectorAll(
          `#aeb_txtQuickReply .smileydropdown:not(.${styles.jsEmojiDropdown}), #aeb_txtQuickReply .controllerbuttondropdown`
        )
      ].map((button) => required(button.closest('.formatbuttons > div')));

    test("should take the site's smiley button's place as a slot of its own, hiding the site's two", async () => {
      const picker = await openQuickReply();
      const [smileySlot, controllerSlot] = siteButtons();

      // Right after the site's smiley slot, in its group, as a toolbar slot itself: the site's button styles
      // (.formatbuttons > div > a) reach its trigger
      expect(smileySlot.nextElementSibling).toBe(picker);
      expect(picker.matches('.formatbuttons > div')).toBe(true);
      expect(required(picker.firstElementChild).matches('.formatbuttons > div > a')).toBe(true);
      expect(smileySlot.classList).toContain(hideClass);
      expect(controllerSlot.classList).toContain(hideClass);
    });

    test('should bring a slot of its own to a box without a smiley button, at the end of the toolbar', async () => {
      setHtml('@ta-x-test-views/forum-thread/quick-reply-box.html');
      // The same box without the site's two buttons
      siteButtons().forEach((slot) => slot.remove());
      setSettings({ 'allPages.emojis': true });

      await run();

      const toolbar = find('#aeb_txtQuickReply .toolbar .formatbuttons:last-child');
      const picker = required(toolbar.lastElementChild);
      expect(picker.classList).toContain(styles.jsEmojis);
      expect(required(picker.firstElementChild).matches('.formatbuttons > div > a')).toBe(true);
    });

    test('should add one picker to a box seen twice', async () => {
      await openQuickReply();

      // The site puts the same box back (it moves it, e.g. replying to another post)
      const box = find('#aeb_txtQuickReply');
      await act(() => {
        box.remove();
        document.body.append(box);
      });
      await tick();
      await tick();

      expect(document.querySelectorAll(`#aeb_txtQuickReply .${styles.jsEmojis}`)).toHaveLength(1);
    });
  });

  describe("an achievement's comment box", () => {
    const openCommentBox = async (): Promise<HTMLElement> => {
      setHtml('@ta-x-test-views/achievement-page/sub-comment-box.html');
      setSettings({ 'allPages.emojis': true });

      await run();

      return find('#aeb_txtAddSubComment');
    };

    test("should replace the site's smiley button even when it has no dropdown", async () => {
      const box = await openCommentBox();
      const slot = required(find('.fa-smile-o', box).closest('.formatbuttons > div'));

      // After the trigger's slot, which is hidden
      expect(slot.classList).toContain(hideClass);
      expect(required(slot.nextElementSibling).className).toBe(`${styles.jsEmojis} ${styles.emojis}`);
      expect(box.querySelectorAll(`.${styles.jsEmojis} svg`)).toHaveLength(1);
    });
  });

  describe('while the page is still loading', () => {
    test('should add the pickers once the page is parsed, one per box, however the box arrived', async () => {
      setSettings({ 'allPages.emojis': true });
      const finishParsing = stillParsing();

      onTestFinished(emojis());
      // The parser adds the box
      document.body.append(quickReplyBox());
      await tick();

      expect(pickers()).toHaveLength(0);

      finishParsing();
      await act(() => tick());
      await tick();

      expect(pickers()).toHaveLength(1);
      expect(toggleScripts()).toHaveLength(1);
    });
  });
});
