import sheet from '@ta-x-scss/index.scss';
import { settings } from '@ta-x-storage';
import { changeSetting, find, mountInPage, renderElement, required, setSettings } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { CheckboxSetting } from './CheckboxSetting';

describe('CheckboxSetting', () => {
  const getInput = (container: ParentNode, id: string) => find<HTMLInputElement>(`#${id}`, container);

  test('should render a site toggle with its style class', () => {
    const row = renderElement(<CheckboxSetting label="Emojis" setting={settings.allPages.emojis} />);

    expect(row.tagName).toBe('DIV');
    expect([...row.classList]).toEqual(['ta-x-checkbox']);
    expect(find('label', row).textContent).toBe('Emojis');
    find('.frm-grp.frm-tgl input[type="checkbox"]', row);
    expect(row.querySelector('p')).toBeNull();
  });

  test('should add its row classes', () => {
    const row = renderElement(
      <CheckboxSetting label="Emojis" setting={settings.allPages.emojis} containerClasses="ta-x-hide-border" />
    );

    expect([...row.classList]).toEqual(['ta-x-checkbox', 'ta-x-hide-border']);
  });

  test.each([true, false])('should show the saved value (%s)', (saved) => {
    setSettings({ 'allPages.emojis': saved });

    const { container } = mountInPage(<CheckboxSetting label="Emojis" setting={settings.allPages.emojis} />);

    expect(getInput(container, 'ta-x-all-pages-emojis').checked).toBe(saved);
  });

  test('should save a change', () => {
    setSettings({ 'allPages.emojis': false });
    const { container } = mountInPage(<CheckboxSetting label="Emojis" setting={settings.allPages.emojis} />);

    changeSetting(getInput(container, 'ta-x-all-pages-emojis'), true);
    expect(settings.allPages.emojis.value).toBe(true);

    changeSetting(getInput(container, 'ta-x-all-pages-emojis'), false);
    expect(settings.allPages.emojis.value).toBe(false);
  });

  test("should use its setting's id for the input, its name and both labels", () => {
    const row = renderElement(<CheckboxSetting label="Label" setting={settings.allPages.emojis} />);
    const input = row.querySelector('input');

    expect([required(input).id, required(input).name]).toEqual(['ta-x-all-pages-emojis', 'ta-x-all-pages-emojis']);
    expect([...row.querySelectorAll('label')].map((label) => label.htmlFor)).toEqual([
      'ta-x-all-pages-emojis',
      'ta-x-all-pages-emojis'
    ]);
  });

  test('should show its helper text when given one', () => {
    const row = renderElement(
      <CheckboxSetting
        label="Sticky Header"
        setting={settings.allPages.stickyHeader.enabled}
        helperText="Let me know what you spot!"
      />
    );

    expect([...find('p', row).classList]).toEqual(['ta-x-settings-helper-text']);
    expect(find('p', row).textContent).toBe('Let me know what you spot!');
  });

  test('should show the helper text for its own state, and switch it as it changes', () => {
    setSettings({ 'allPages.emojis': false });
    const { container } = mountInPage(
      <CheckboxSetting
        label="Emojis"
        setting={settings.allPages.emojis}
        helperTextWhenChecked="It's on"
        helperTextWhenUnchecked="It's off"
      />
    );

    expect(find('p', container).textContent).toBe("It's off");

    changeSetting(getInput(container, 'ta-x-all-pages-emojis'), true);
    expect(find('p', container).textContent).toBe("It's on");
    expect([...find('p', container).classList]).toEqual(['ta-x-settings-helper-text']);

    changeSetting(getInput(container, 'ta-x-all-pages-emojis'), false);
    expect(find('p', container).textContent).toBe("It's off");
  });

  test('should show no helper text for a state that has none', () => {
    setSettings({ 'allPages.emojis': true });
    const { container } = mountInPage(
      <CheckboxSetting label="Emojis" setting={settings.allPages.emojis} helperTextWhenUnchecked="It's off" />
    );

    expect(container.querySelector('p')).toBeNull();
  });

  // Following another tab is the setting's own job (storage/setting.spec.ts): the row only shows what the setting holds
  test("should show the setting's value as it changes", async () => {
    setSettings({ 'allPages.emojis': false });
    const { container } = mountInPage(<CheckboxSetting label="Emojis" setting={settings.allPages.emojis} />);

    await act(() => {
      settings.allPages.emojis.value = true;
    });

    expect(getInput(container, 'ta-x-all-pages-emojis').checked).toBe(true);
  });

  // The site's toggle CSS hides the checkbox (display: none) and draws the switch with the label, so the keyboard can't
  // reach it: in our menu it stays in the Tab order, unseen, and the switch is ringed while it has the keyboard's focus
  test('should be reached by the keyboard in the settings menu, ringing the switch on focus', () => {
    const toggle =
      'body.trueachievement-extras .ta-x-settings-menu .t-settings .ta-x-checkbox .frm-tgl input[type=checkbox]';
    const rule = (selector: string): string =>
      sheet
        .split('}')
        .find((part) => part.split('{')[0].trim().endsWith(selector))
        ?.split('{')[1] ?? '';

    expect(rule(toggle)).toContain('display:block');
    expect(rule(toggle)).toContain('opacity:0');
    expect(rule(`${toggle}:focus-visible+label:before`)).toContain('outline:2px solid #fff');
  });
});
