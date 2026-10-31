import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { settingsList } from '@ta-x-storage';
import {
  click,
  elementOf,
  find,
  findByText,
  mountForTest,
  mountInPage,
  pressKey,
  renderElement,
  required,
  setSettings,
  visibleTabs
} from '@ta-x-test';
import { hideClass, TabsStyles } from '@ta-x-ui';
import { act } from 'preact/test-utils';

import { settingsTabs } from '../../../settings-tabs';
import { settingsMenuOpen } from '../settings-menu-open';
import { showEveryTab } from '../settings-menu.spec-helpers';
import { SettingsMenuButton } from '../SettingsMenuButton';
import styles from '../styles';

import { SettingsMenu } from './SettingsMenu';

describe('SettingsMenu', () => {
  const render = () => renderElement(<SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />);
  // Mounted, for the tests that open it: it builds a tab the first time it shows one
  const mountMenu = () => elementOf(mountInPage(<SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />).root);

  test('should render a hidden dialog with its hook classes', () => {
    const menu = render();

    expect([...menu.classList]).toEqual(['js-ta-x-settings-menu', 'ta-x-settings-menu', 'ta-x-hide']);
    expect(['role', 'aria-modal', 'aria-label', 'tabindex'].map((name) => menu.getAttribute(name))).toEqual([
      'dialog',
      'true',
      'TrueAchievements Extra Settings',
      '-1'
    ]);
    expect(menu.querySelectorAll('.close')).toHaveLength(2);
    expect(find('label.close svg path', menu).getAttribute('d')).toBe(faXmark.icon[4]);
  });

  // The close stays the site's label (its look); the button is the icon's wrapper in it
  test('should make its close a keyboard button, and leave the backdrop to the mouse', () => {
    const [close, backdrop] = [...render().querySelectorAll('.close')];
    const button = find('[role="button"]', close);

    expect(button.querySelector('svg')).not.toBeNull();
    expect(['role', 'tabindex', 'aria-label'].map((name) => button.getAttribute(name))).toEqual([
      'button',
      '0',
      'Close Settings'
    ]);
    expect(['role', 'tabindex', 'aria-hidden'].map((name) => backdrop.getAttribute(name))).toEqual([
      null,
      null,
      'true'
    ]);
  });

  test('should build no tab or view until the menu opens, then each the first time it shows, keeping it', () => {
    const menu = mountMenu();
    const built = () =>
      [...menu.querySelectorAll('.contents > [id]')]
        .filter((content) => content.childElementCount > 0)
        .map(({ id }) => id);

    expect(built()).toEqual([]);

    void act(() => {
      settingsMenuOpen.value = true;
    });
    expect(built()).toEqual(['ta-x-tabs-general']);

    click(findByText('.ta-x-tabs-link', 'News', menu));
    void act(() => {
      settingsMenuOpen.value = false;
    });
    expect(built()).toEqual(['ta-x-tabs-general', 'ta-x-tabs-news']);
  });

  test('should render a tab per feature, with the first selected and shown', () => {
    const menu = mountMenu();
    showEveryTab(menu);
    const links = [...menu.querySelectorAll('.ta-x-tabs-link-container .ta-x-tabs-link')];

    expect(
      links.map((link) => [link.textContent, link.getAttribute('aria-controls'), link.getAttribute('aria-selected')])
    ).toEqual([
      ['General', 'ta-x-tabs-general', 'true'],
      ['Forums', 'ta-x-tabs-forums', 'false'],
      ['Gamer', 'ta-x-tabs-gamer', 'false'],
      ['Games', 'ta-x-tabs-games', 'false'],
      ['News', 'ta-x-tabs-news', 'false'],
      ['Staff', 'ta-x-tabs-staff', 'false']
    ]);
    // Each tab holds its feature's settings panel (each panel's spec checks its rows): its first control is the panel's
    const contents = links.map((link) => find(`#${link.getAttribute('aria-controls')}`, menu));
    contents.forEach((content) => expect(content).toHaveExactClasses([TabsStyles.tabsContent, 't-settings']));
    expect(contents.map((content) => find('input[type="checkbox"], select, ul.item-list', content).id)).toEqual([
      'ta-x-all-pages-sticky-header-enabled',
      'ta-x-forum-thread-filter',
      'ta-x-gamer-achievements-add-group-by-game-button',
      'ta-x-games-list-add-highlight-games-not-in-collection-button',
      'ta-x-news-sales-auto-sort-by',
      'ta-x-staff-walkthrough-edit-walkthrough-page-improved-image-selector'
    ]);
    expect([...menu.querySelectorAll('[data-tab-visible]')].map((content) => content.id)).toEqual([
      'ta-x-tabs-general'
    ]);
  });

  test('should render the latest changes, the credits and the documentation from the project markdown', () => {
    const menu = mountMenu();
    showEveryTab(menu);
    const changelog = find('#ta-x-tabs-changelog-credits.t-settings', menu);
    const documentation = find('#ta-x-tabs-feature-documentation.t-settings', menu);

    expect(changelog.querySelector('.ta-x-settings-menu-changelog-wrapper .ta-x-markdown-marker')).not.toBeNull();
    expect(
      find('.ta-x-settings-menu-changelog-wrapper a.ta-x-settings-menu-changelog-link', changelog).textContent
    ).toBe('See the full changelog here');
    expect(find('.ta-x-settings-menu-credits-wrapper', changelog).textContent).not.toBe('');
    expect(find('.ta-x-settings-menu-documentation-wrapper', documentation).textContent).not.toBe('');
  });

  test('should show the credits, then the libraries in a closed accordion', () => {
    const menu = mountMenu();
    showEveryTab(menu);
    const changelog = find('#ta-x-tabs-changelog-credits', menu);
    const header = find<HTMLButtonElement>(':scope > button.ta-x-accordion', changelog);
    const libraries = find(`#${required(header.getAttribute('aria-controls'))}`, changelog);

    expect(find('h1', find('.ta-x-settings-menu-credits-wrapper', changelog)).textContent).toBe('Credits');
    expect([header.textContent, header.getAttribute('aria-expanded')]).toEqual(['Projects and sites', 'false']);
    // Each library with its repo
    expect(libraries.querySelectorAll('li').length).toBeGreaterThan(3);
    expect(find<HTMLAnchorElement>('a', libraries).href.startsWith('https://github.com/')).toBe(true);
  });

  // FEATURE-DOCUMENTATION.md follows the menu: a section per tab, its groups the tab's own, in the same order
  test("should show the documentation's intro, then a closed accordion per settings tab with the tab's groups", () => {
    const menu = mountMenu();
    showEveryTab(menu);
    const documentation = find('#ta-x-tabs-feature-documentation', menu);
    const headers = [...documentation.querySelectorAll<HTMLButtonElement>(':scope > button.ta-x-accordion')];
    const groups = (panel: Element, selector: string) =>
      [...panel.querySelectorAll(selector)].map((heading) => heading.textContent);

    expect(documentation.firstElementChild).toHaveExactClasses([styles.documentationWrapper]);
    expect(find('h1', documentation.firstElementChild ?? documentation).textContent).toBe('Feature Documentation');
    expect(headers.map((header) => [header.textContent, header.getAttribute('aria-expanded')])).toEqual(
      settingsTabs.map(({ label }) => [label, 'false'])
    );
    expect(
      headers.map((header) => groups(find(`#${required(header.getAttribute('aria-controls'))}`, documentation), 'h2'))
    ).toEqual(settingsTabs.map(({ id }) => groups(find(`#ta-x-tabs-${id}`, menu), ':scope > .ta-x-accordion')));
  });

  // A setting's ### heading is its label, in the menu's order; a feature with no setting says so in its heading
  test("should head each documented setting with its menu label, in the menu's order", () => {
    // Every toggle on, so the rows they reveal (an override's, a sub-setting's) show too
    setSettings(
      Object.fromEntries(
        settingsList()
          .filter(({ setting }) => setting.storedAs === 'boolean')
          .map(({ path }) => [path, true])
      )
    );
    const menu = mountMenu();
    showEveryTab(menu);
    const documentation = find('#ta-x-tabs-feature-documentation', menu);
    const sections = [...documentation.querySelectorAll(':scope > button.ta-x-accordion')].map((header) =>
      find(`#${required(header.getAttribute('aria-controls'))}`, documentation)
    );
    // One heading covers the three guide sites' settings
    const combined: Record<string, string[]> = {
      'Show XboxAchievements.com / PlaystationTrophies.org / GamertagNation.com Guides': [
        'Show XboxAchievements.com Guides',
        'Show PlaystationTrophies.org Guides',
        'Show GamertagNation.com Guides'
      ]
    };
    const headings = (section: Element) =>
      [...section.querySelectorAll('h3')]
        .map((heading) => heading.textContent)
        .filter((heading) => !heading.includes('no setting)'))
        .flatMap((heading) => combined[heading] ?? [heading]);
    const labels = (id: string) =>
      [...find(`#ta-x-tabs-${id}`, menu).querySelectorAll('label')]
        .map((label) => label.textContent.trim())
        .filter(Boolean);
    // Each heading must be a label shown after the one before it
    const unmatched = settingsTabs.flatMap(({ id }, index) => {
      const shown = labels(id);
      let from = 0;

      return headings(required(sections[index]))
        .filter((heading) => {
          const at = shown.indexOf(heading, from);
          from = at === -1 ? from : at + 1;
          return at === -1;
        })
        .map((heading) => `${id}: ${heading}`);
    });

    expect(unmatched).toEqual([]);
  });

  test('should show the version and the documentation link in the footer', () => {
    const footer = find('.ta-x-settings-menu-bottom', render());

    // Both open a view in the menu (their own test clicks them), so neither leaves the page
    expect(
      [findByText('a', 'Version 3.2.0', footer), findByText('a', 'Feature Documentation', footer)].map((link) =>
        link.getAttribute('href')
      )
    ).toEqual(['#', '#']);
    expect(
      [...footer.querySelectorAll<HTMLAnchorElement>('.list-links a')].map((link) => [link.textContent, link.href])
    ).toEqual([
      ['Raise a Bug', 'https://github.com/dynamiteandy/trueachievements-extra/issues/new?template=bug_report.md'],
      [
        'Request a Feature',
        'https://github.com/dynamiteandy/trueachievements-extra/issues/new?template=feature_request.md'
      ]
    ]);
  });

  // A screen reader names a dropdown by its label beside it or, with none (a toggle above names only its checkbox), by
  // its aria-label. Every setting on, so every dropdown is shown
  test('should give every dropdown a name', () => {
    setSettings(
      Object.fromEntries(
        settingsList()
          .filter(({ setting }) => typeof setting.value === 'boolean')
          .map(({ path }) => [path, true])
      )
    );
    const { container } = mountInPage(<SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />);
    showEveryTab(container);

    const selects = [...container.querySelectorAll('select')];
    const unnamed = selects.filter(
      (select) => !select.getAttribute('aria-label') && !container.querySelector(`label[for="${select.id}"]`)
    );

    expect(selects.length).toBeGreaterThan(5);
    expect(unnamed.map(({ id }) => id)).toEqual([]);
  });
});

describe('SettingsMenu when open', () => {
  beforeEach(() => {
    settingsMenuOpen.value = true;
  });

  test('should show as the site gamer panel does', () => {
    const menu = renderElement(<SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />);

    expect([...menu.classList]).toEqual(['js-ta-x-settings-menu', 'ta-x-settings-menu', 'nav-gamer', 'open']);
  });

  test.each([
    { control: 'its close button', index: 0 },
    { control: 'its backdrop', index: 1 }
  ])('should close from $control', async ({ index }) => {
    const { element: menu } = mountForTest(
      <SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />,
      document.createElement('div')
    );
    const closes = [...required(menu).querySelectorAll<HTMLElement>('.close')];

    await act(() => closes[index].click());

    expect(settingsMenuOpen.value).toBe(false);
    expect(required(menu)).toHaveExactClasses([styles.jsFeature, styles.menu, hideClass]);
  });

  test('should toggle the changelog and documentation views from the footer links, without following them', () => {
    const { element: menu } = mountForTest(
      <SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />,
      document.createElement('div')
    );
    const clickLink = (text: string): MouseEvent => click(findByText('a', text, menu));

    expect(clickLink('Version 3.2.0').defaultPrevented).toBe(true);
    expect(visibleTabs(menu)).toEqual(['ta-x-tabs-changelog-credits']);
    expect(required(menu).querySelector('[aria-selected="true"]')).toBeNull();

    expect(clickLink('Feature Documentation').defaultPrevented).toBe(true);
    expect(visibleTabs(menu)).toEqual(['ta-x-tabs-feature-documentation']);

    clickLink('Feature Documentation');
    expect(visibleTabs(menu)).toEqual(['ta-x-tabs-general']);
  });

  test.each([
    { name: 'Enter', key: 'Enter' },
    { name: 'Space', key: ' ' }
  ])('should toggle the changelog and documentation views from the footer links with $name', ({ key }) => {
    const { element: menu } = mountForTest(
      <SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />,
      document.createElement('div')
    );
    const pressLink = (text: string): KeyboardEvent => pressKey(findByText('a', text, menu), key);

    expect(findByText('a', 'Version 3.2.0', menu).getAttribute('role')).toBe('button');
    expect(pressLink('Version 3.2.0').defaultPrevented).toBe(true);
    expect(visibleTabs(menu)).toEqual(['ta-x-tabs-changelog-credits']);

    expect(findByText('a', 'Feature Documentation', menu).getAttribute('role')).toBe('button');
    expect(pressLink('Feature Documentation').defaultPrevented).toBe(true);
    expect(visibleTabs(menu)).toEqual(['ta-x-tabs-feature-documentation']);
  });
});

describe('SettingsMenu with the keyboard', () => {
  const getMenu = () => find(`.${styles.menu}`);
  const getWrench = () => find(`.${styles.wrench}`);
  const getClose = () => find('label.close [role="button"]', getMenu());
  const link = (text: string) =>
    required([...getMenu().querySelectorAll<HTMLElement>('a')].find((anchor) => anchor.textContent === text));

  // A key pressed wherever focus is
  const keyDown = (key: string, shiftKey = false): KeyboardEvent =>
    pressKey(document.activeElement ?? document.body, key, { shiftKey });

  const setOpen = (open: boolean): void => {
    void act(() => {
      settingsMenuOpen.value = open;
    });
  };

  // The wrench and the menu, mounted apart as on the site
  beforeEach(() => {
    mountInPage(<SettingsMenuButton />);
    mountInPage(<SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />);
  });

  test('should move focus to the dialog when it opens, and back to the wrench when it closes, scrolling neither', () => {
    // The menu covers the page from its top, so focusing either mustn't scroll it
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');

    setOpen(true);
    expect(document.activeElement).toBe(getMenu());

    setOpen(false);
    expect(document.activeElement).toBe(getWrench());
    expect(focus.mock.calls).toEqual([[{ preventScroll: true }], [{ preventScroll: true }]]);
  });

  test('should close on Escape, wherever focus is in it, and stop listening once closed', () => {
    setOpen(true);
    link('Raise a Bug').focus();

    expect(keyDown('Escape').defaultPrevented).toBe(true);
    expect(settingsMenuOpen.value).toBe(false);
    expect(document.activeElement).toBe(getWrench());

    expect(keyDown('Escape').defaultPrevented).toBe(false);
  });

  // A list setting's field clears what was typed on Escape: only an Escape nothing used closes it
  test('should stay open on an Escape a control used itself, closing on the next', () => {
    setOpen(true);
    // A field using one Escape, as a list setting's does with text in it (its own spec)
    const field = document.createElement('input');
    let used = false;
    field.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !used) {
        used = true;
        event.preventDefault();
      }
    });
    getMenu().append(field);
    field.focus();

    keyDown('Escape');
    expect(settingsMenuOpen.value).toBe(true);

    keyDown('Escape');
    expect(settingsMenuOpen.value).toBe(false);
  });

  test.each([
    { name: 'Enter', key: 'Enter' },
    { name: 'Space', key: ' ' }
  ])('should close from its close button with $name, focus going back to the wrench', ({ key }) => {
    setOpen(true);
    getClose().focus();

    expect(keyDown(key).defaultPrevented).toBe(true);
    expect(settingsMenuOpen.value).toBe(false);
    expect(document.activeElement).toBe(getWrench());
  });

  describe('Tab', () => {
    // Only the close and the footer's two issue links showing: the tab bar, the panels and the footer's version and
    // documentation links hidden, as Tab passes over what doesn't show
    beforeEach(() => {
      const style = document.createElement('style');
      style.textContent = '.tabs-nav, [role="tabpanel"], .ta-x-settings-menu-bottom .title { display: none; }';
      document.head.append(style);
      onTestFinished(() => style.remove());
      setOpen(true);
    });

    test('should go from the last control round to the first, and back with Shift', () => {
      link('Request a Feature').focus();
      expect(keyDown('Tab').defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(getClose());

      expect(keyDown('Tab', true).defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(link('Request a Feature'));
    });

    // A collapsed group's content is inert: Tab skips it, so a control in it can't be the last stop
    test('should pass over controls inside inert content', () => {
      const collapsed = document.createElement('div');
      collapsed.inert = true;
      collapsed.append(Object.assign(document.createElement('button'), { textContent: 'In a collapsed group' }));
      getMenu().append(collapsed);

      link('Request a Feature').focus();
      expect(keyDown('Tab').defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(getClose());
    });

    test('should leave Tab between its controls to the browser', () => {
      link('Raise a Bug').focus();
      expect(keyDown('Tab').defaultPrevented).toBe(false);
      expect(keyDown('Tab', true).defaultPrevented).toBe(false);
    });

    test.each([
      { from: 'the dialog itself', shiftKey: false, to: 'the close', focus: () => getMenu().focus() },
      { from: 'the dialog itself', shiftKey: true, to: 'the last link', focus: () => getMenu().focus() },
      { from: 'the page behind it', shiftKey: false, to: 'the close', focus: () => getWrench().focus() }
    ])('should take focus from $from to $to (Shift: $shiftKey)', ({ shiftKey, to, focus }) => {
      focus();

      expect(keyDown('Tab', shiftKey).defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(to === 'the close' ? getClose() : link('Request a Feature'));
    });

    test('should leave other keys alone', () => {
      expect(keyDown('a').defaultPrevented).toBe(false);
      expect(settingsMenuOpen.value).toBe(true);
    });
  });

  test('should keep the tab bar reachable while the changelog shows, by its first tab', () => {
    const style = document.createElement('style');
    style.textContent = '[role="tabpanel"], .ta-x-settings-menu-bottom .title { display: none; }';
    document.head.append(style);
    onTestFinished(() => style.remove());
    setOpen(true);
    click(link('Version 3.2.0'));

    link('Request a Feature').focus();
    expect(keyDown('Tab').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(find('[role="tab"]', getMenu()));
  });

  // The tab bar is one stop in the Tab order, its selected tab (the others take tabindex -1 and the arrow keys)
  test('should go round to the selected tab, passing over the tabs out of the Tab order', () => {
    const style = document.createElement('style');
    style.textContent = '[role="tabpanel"], .ta-x-settings-menu-bottom .title { display: none; }';
    document.head.append(style);
    onTestFinished(() => style.remove());
    setOpen(true);
    const newsTab = find('[aria-controls="ta-x-tabs-news"]', getMenu());
    click(newsTab);

    link('Request a Feature').focus();
    expect(keyDown('Tab').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(newsTab);
  });
});
