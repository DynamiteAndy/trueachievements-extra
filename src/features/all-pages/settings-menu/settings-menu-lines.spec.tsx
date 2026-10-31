import sheet from '@ta-x-scss/index.scss';
import { settingsList } from '@ta-x-storage';
import { mountInPage, setSettings } from '@ta-x-test';
import { rootClass } from '@ta-x-ui';

import { settingsTabs } from '../../settings-tabs';

import { showEveryTab } from './settings-menu.spec-helpers';
import { SettingsMenu } from './SettingsMenu';

// The lines between the settings rows, as the site's gamer menu draws them (_settings.scss): one under every row, none
// inside a toggle's group (a row followed by one it reveals, marked underToggle) and none under a tab's last row. Every
// panel, with every setting on (each toggle's rows shown) and every setting off, in both themes
describe('the settings menu lines', () => {
  const revealed = 'ta-x-hide-padding-top';

  // A tab's rows in order: each group's header is a sibling of its rows' container
  const rowsOf = (tab: Element): { row: HTMLElement; beforeHeader: boolean }[] => {
    const parts = [...tab.children];
    return parts.flatMap((part, index) => {
      if (part.matches('.ta-x-accordion')) {
        return [];
      }
      const rows = part.matches('.ta-x-accordion-content') ? [...part.children] : [part];
      return rows.map((row, at) => ({
        row: row as HTMLElement,
        beforeHeader: at === rows.length - 1 && Boolean(parts[index + 1]?.matches('.ta-x-accordion'))
      }));
    });
  };

  // The settings tabs' panels (the menu's Changelog and Feature Documentation are tabs too)
  const settingsPanels = (): Element[] =>
    settingsTabs
      .map(({ id }) => document.querySelector(`.ta-x-settings-menu #ta-x-tabs-${id}`))
      .filter((tab) => tab !== null);

  // Each row that breaks the rule, by its tab, label and whether it has a line
  const misdrawn = (): string[] =>
    settingsPanels().flatMap((tab) => {
      const rows = rowsOf(tab);
      return rows.flatMap(({ row, beforeHeader }, index) => {
        const next = rows[index + 1]?.row;
        const expected = beforeHeader || (next !== undefined && !next.classList.contains(revealed));
        const drawn = parseFloat(getComputedStyle(row).borderBottomWidth) > 0;
        const name = row.querySelector('label')?.textContent.trim() ?? row.className;
        return drawn === expected ? [] : [`${tab.id} | ${name} | ${drawn ? 'a line' : 'no line'}`];
      });
    });

  const openMenu = (theme: 'dark' | 'light'): HTMLElement => {
    const style = document.createElement('style');
    style.textContent = sheet;
    document.head.append(style);
    onTestFinished(() => style.remove());
    document.body.classList.add(rootClass);

    const page = document.createElement('div');
    page.className = 'page';
    page.dataset.theme = theme === 'dark' ? 'dark' : 'normal';
    document.body.append(page);
    const { container } = mountInPage(<SettingsMenu version="3.2.0" settingsTabs={settingsTabs} />);
    page.append(container);
    showEveryTab(container);
    return page;
  };

  // Each row's control id (its checkbox, dropdown or list), and whether the row is marked as revealed
  const markedRows = (): Map<string, boolean> =>
    new Map(
      settingsPanels()
        .flatMap(rowsOf)
        .flatMap(({ row }) => {
          const id = row.querySelector('input, select, ul')?.id;
          return id ? [[id, row.classList.contains(revealed)] as const] : [];
        })
    );

  // Every on/off setting at once
  const setAll = (value: boolean): void =>
    setSettings(
      Object.fromEntries(
        settingsList()
          .filter(({ setting }) => typeof setting.value === 'boolean')
          .map(({ path }) => [path, value])
      )
    );

  test.each([
    { name: 'every setting on, dark', on: true, theme: 'dark' as const },
    { name: 'every setting on, light', on: true, theme: 'light' as const },
    { name: 'every setting off, dark', on: false, theme: 'dark' as const },
    { name: 'every setting off, light', on: false, theme: 'light' as const }
  ])(
    'should draw a line under every row but inside a toggle group and under a tab’s last, with $name',
    ({ on, theme }) => {
      setAll(on);
      openMenu(theme);

      expect(settingsPanels()).toHaveLength(settingsTabs.length);
      // Rows to check, not an empty menu passing
      expect(settingsPanels().flatMap(rowsOf).length).toBeGreaterThan(20);
      expect(misdrawn()).toEqual([]);
    }
  );

  // The lines above trust each row's own mark, so a revealed row left unmarked would pass them. The rows only a
  // toggle being on shows are the revealed ones, and each must say so
  test('should mark as revealed every row that only shows while a toggle is on', () => {
    setAll(false);
    const off = openMenu('dark');
    const shownWhenOff = new Set(markedRows().keys());
    off.remove();

    setAll(true);
    openMenu('dark');
    const onlyWhenOn = [...markedRows()].filter(([id]) => !shownWhenOff.has(id));

    // Toggles to check, not a menu with none
    expect(onlyWhenOn.length).toBeGreaterThan(10);
    expect(onlyWhenOn.filter(([, marked]) => !marked).map(([id]) => id)).toEqual([]);
  });
});
