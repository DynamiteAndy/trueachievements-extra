import vm from 'node:vm';

import { pageScript } from '@ta-x-page';
import { required } from '@ta-x-test';

import { defineDropdownToggle } from './dropdown-toggle';

// Run from its source in a context holding only the page's globals, as it is in the page
describe('all-pages/emojis defineDropdownToggle', () => {
  type Toggle = (button: unknown) => void;

  test("should leave the site's own toggle where the page has one", () => {
    const sitesOwn = (): void => undefined;
    const page = { DropdownButtonPanel_Toggle: sitesOwn };

    vm.runInNewContext(pageScript(defineDropdownToggle), { window: page });

    expect(page.DropdownButtonPanel_Toggle).toBe(sitesOwn);
  });

  // The toggle run against a stand-in for the site's jQuery, recording what it's asked to do: each button's panel is
  // `panel`; `showing` are the panels open, and `panels` what the site's `.dropdownbuttonpanel` finds
  const toggleWith = ({ showing, panels }: { showing: string[]; panels: string[] }) => {
    const calls: string[] = [];
    const wrap = (name: string) => ({
      length: 1,
      0: name,
      parent: () => ({ children: () => ['panel'] }),
      css: (property: string, value?: string | number) => {
        if (value === undefined) {
          return showing.includes(name) ? 'block' : 'none';
        }
        calls.push(`${name}.${property}=${value}`);
        return undefined;
      },
      position: () => ({ top: 10, left: 20 }),
      height: () => 30,
      slideUp: () => calls.push(`${name}.slideUp`),
      slideDown: () => calls.push(`${name}.slideDown`)
    });
    const $ = (target: string) =>
      target === '.dropdownbuttonpanel'
        ? { length: panels.length, ...Object.fromEntries(panels.entries()) }
        : wrap(target);
    const page: { $: typeof $; DropdownButtonPanel_Toggle?: Toggle } = { $ };
    vm.runInNewContext(pageScript(defineDropdownToggle), { window: page });

    required(page.DropdownButtonPanel_Toggle)('button');

    return calls;
  };

  test("should open a closed panel under its button with the site's jQuery, closing the open ones", () => {
    expect(toggleWith({ showing: ['open-panel'], panels: ['open-panel'] })).toEqual([
      'open-panel.slideUp',
      'panel.top=51',
      'panel.left=22',
      'panel.position=absolute',
      'panel.slideDown'
    ]);
  });

  test('should close its panel when it is open, leaving the others', () => {
    expect(toggleWith({ showing: ['panel', 'other-panel'], panels: ['panel', 'other-panel'] })).toEqual([
      'panel.slideUp'
    ]);
  });
});
