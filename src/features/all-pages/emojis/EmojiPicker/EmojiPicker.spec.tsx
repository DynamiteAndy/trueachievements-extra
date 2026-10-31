import { find, mountForTest, pressKey, required, setHtml, visibleTabs } from '@ta-x-test';
import { hideClass, TabsStyles } from '@ta-x-ui';
import { act } from 'preact/test-utils';

import styles from '../styles';

import { EmojiPicker } from './EmojiPicker';

describe('all-pages/emojis/EmojiPicker', () => {
  const groups = [
    { group: 'Smileys & Emotion', emojis: [{ char: '😀', name: 'grinning face' }] },
    { group: 'Flags', emojis: [{ char: '🏁', name: 'chequered flag' }] }
  ];

  const render = (): HTMLElement | null =>
    mountForTest(<EmojiPicker textareaId="txtQuickReply" groups={groups} />, document.body).element;
  // A tab panel's id: its group's page-unique id (useTabs), then the tab's
  const panelId = (id: string) => expect.stringMatching(new RegExp(`^ta-x-tabs-group-\\d+-${id}$`));
  // A tab's panel, found by the end of its id
  const panelOf = (picker: HTMLElement | null, id: string) =>
    required(picker).querySelector(`[role="tabpanel"][id$="-${id}"]`);

  test('renders the picker with its hook classes, a toggle button and the hidden panel', () => {
    const picker = render();

    expect(required(picker).className).toBe(`${styles.jsEmojis} ${styles.emojis}`);
    expect(find('a', picker).getAttribute('onclick')).toBe('DropdownButtonPanel_Toggle(this); return false;');
    expect(find(`.${styles.jsEmojiDropdown}`, picker).className).toBe(
      `smileydropdown dropdownbuttonpanel ${styles.jsEmojiDropdown}`
    );
    // Shown by the site's dropdown toggle
    expect(find<HTMLElement>(`.${styles.jsEmojiDropdown}`, picker).style.display).toBe('none');
  });

  test("puts the site's smileys and controller buttons first, then each emoji group", () => {
    const picker = render();

    expect([...required(picker).querySelectorAll(`.${TabsStyles.tabsLink}`)].map((link) => link.textContent)).toEqual([
      'TrueAchievements',
      'Controller',
      'Smileys & Emotion',
      'Flags'
    ]);
    expect([...required(picker).querySelectorAll(`.${TabsStyles.tabsContent}`)].map((content) => content.id)).toEqual([
      panelId('trueachievements'),
      panelId('controller'),
      panelId('smileysemotion'),
      panelId('flags')
    ]);
  });

  test("gives each picker's tabs ids of their own, so two on a page don't share them", () => {
    const ids = (picker: HTMLElement | null) => [
      ...[...required(picker).querySelectorAll(`.${TabsStyles.tabsContent}`)].map((content) => content.id),
      ...[...required(picker).querySelectorAll(`.${TabsStyles.tabsLink}`)].map((link) =>
        link.getAttribute('aria-controls')
      )
    ];
    const first = ids(render());
    const second = ids(render());

    expect(new Set([...first, ...second]).size).toBe(8);
    // Each tab still controls its own picker's panel
    expect(first.slice(4)).toEqual(first.slice(0, 4));
    expect(second.slice(4)).toEqual(second.slice(0, 4));
  });

  test('shows the first tab, and switches tabs, keeping each item ready to insert', async () => {
    const picker = render();
    const links = [...required(picker).querySelectorAll<HTMLElement>(`.${TabsStyles.tabsLink}`)];

    expect(visibleTabs(picker)).toEqual([panelId('trueachievements')]);
    expect(links[0].getAttribute('aria-selected')).toBe('true');

    await act(() => links[3].click());

    expect(visibleTabs(picker)).toEqual([panelId('flags')]);
    expect(links.map((link) => link.getAttribute('aria-selected'))).toEqual(['false', 'false', 'false', 'true']);
  });

  test("builds an emoji tab's items the first time it's opened, and keeps them", async () => {
    const picker = render();
    const links = [...required(picker).querySelectorAll<HTMLElement>(`.${TabsStyles.tabsLink}`)];
    const items = (id: string) => required(panelOf(picker, id)).querySelectorAll(':scope > span');

    // The site's smileys and controller buttons straight away, no emoji group yet
    expect(items('trueachievements')).toHaveLength(20);
    expect(items('controller')).toHaveLength(40);
    expect(items('smileysemotion')).toHaveLength(0);
    expect(items('flags')).toHaveLength(0);

    await act(() => links[3].click());
    const flag = items('flags')[0];

    expect(items('flags')).toHaveLength(1);
    expect(items('smileysemotion')).toHaveLength(0);

    // Switching away and back keeps the same items, not new ones
    await act(() => links[2].click());
    await act(() => links[3].click());

    expect(items('smileysemotion')).toHaveLength(1);
    expect(items('flags')[0]).toBe(flag);
  });

  test("hides the site's buttons it stands in for, and gives them back when it goes", async () => {
    // The site's smiley and controller buttons, each the toolbar div holding it
    setHtml('@ta-x-test-views/forum-thread/quick-reply-box.html');
    const siteButtons = [
      ...document.querySelectorAll('#aeb_txtQuickReply .smileydropdown, #aeb_txtQuickReply .controllerbuttondropdown')
    ].map((button) => required(button.closest('.formatbuttons > div')));
    const hidden = () => siteButtons.map((button) => button.classList.contains(hideClass));
    const toolbar = document.createElement('div');

    const picker = mountForTest(
      <EmojiPicker textareaId="txtQuickReply" groups={[]} siteButtons={siteButtons} />,
      toolbar
    );

    expect(siteButtons).toHaveLength(2);
    expect(hidden()).toEqual([true, true]);

    await act(() => picker.unmount());

    expect(toolbar.querySelector(`.${styles.jsEmojis}`)).toBeNull();
    expect(hidden()).toEqual([false, false]);
  });

  test("inserts each emoji into the given textarea through the site's InsertAtCursor", async () => {
    const picker = render();
    await act(() => find<HTMLElement>('[aria-controls$="-flags"]', picker).click());
    const emoji = find('span', panelOf(picker, 'flags'));

    expect(emoji.textContent).toBe('🏁');
    expect(emoji.getAttribute('title')).toBe('chequered flag');
    expect(emoji.getAttribute('onclick')).toBe(
      `InsertAtCursor('txtQuickReply','🏁', '${styles.jsEmojiDropdown}'); return false;`
    );
  });

  // Its click runs the site's inline InsertAtCursor in the page, as a mouse click does
  test.each([
    { panel: 'trueachievements', key: 'Enter' },
    { panel: 'controller', key: ' ' },
    { panel: 'flags', key: 'Enter' }
  ])("inserts an item from the $panel tab with the keyboard ('$key'), focusable and named", async ({ panel, key }) => {
    const picker = render();
    await act(() => find<HTMLElement>(`[aria-controls$="-${panel}"]`, picker).click());
    const item = find('span', panelOf(picker, panel));
    const click = vi.fn();
    item.addEventListener('click', click);

    expect([item.tabIndex, item.getAttribute('role')]).toEqual([0, 'button']);
    expect(item.getAttribute('aria-label') ?? item.querySelector('img')?.alt).toBeTruthy();
    expect(pressKey(item, key).defaultPrevented).toBe(true);
    expect(click).toHaveBeenCalledOnce();
  });
});
