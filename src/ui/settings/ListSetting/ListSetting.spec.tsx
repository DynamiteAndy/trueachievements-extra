import { settings } from '@ta-x-storage';
import { click, find, mountInPage, pressKey, renderElement, setSettings } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { ListSetting } from './ListSetting';

describe('ListSetting', () => {
  const listId = 'ta-x-forum-thread-filter-keywords';

  const mountList = () =>
    mountInPage(<ListSetting setting={settings.forum.threadFilterKeywords} label="Keywords" buttonText="Add Keyword" />)
      .container;

  const getValues = (container: HTMLElement) => [...container.querySelectorAll('li p')].map((item) => item.textContent);

  const type = async (container: HTMLElement, value: string) => {
    const field = find<HTMLInputElement>(`#${listId}-input`, container);

    await act(() => {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
  };

  test('should render the site list with its field, add button and list', () => {
    const row = renderElement(
      <ListSetting
        setting={settings.forum.threadFilterKeywords}
        label="Keywords"
        buttonText="Add Keyword"
        containerClasses="ta-x-hide-border"
      />
    );
    const field = find<HTMLInputElement>('.frm-grp.frm-lst input.textbox.cs-n', row);

    expect([...row.classList]).toEqual(['ta-x-listbox', 'ta-x-hide-border']);
    expect(find('label', row).htmlFor).toBe(`${listId}-input`);
    expect([field.type, field.id, field.name]).toEqual(['text', `${listId}-input`, `${listId}-input`]);
    expect(find<HTMLInputElement>('input[type="submit"]', row).value).toBe('Add Keyword');
    find(`ul.item-list#${listId}`, row);
  });

  test('should list the saved values', () => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough', 'sale'] });

    expect(getValues(mountList())).toEqual(['walkthrough', 'sale']);
  });

  test('should keep a value with markup in it as text', () => {
    setSettings({ 'forum.threadFilterKeywords': ['<b>bold</b>'] });
    const container = mountList();

    expect(getValues(container)).toEqual(['<b>bold</b>']);
    expect(container.querySelector('b')).toBeNull();
  });

  test('should add a value, save it and clear the field, without submitting the page', async () => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough'] });
    const container = mountList();

    await type(container, 'sale');
    const event = click(find('input[type="submit"]', container));

    expect(event.defaultPrevented).toBe(true);
    expect(getValues(container)).toEqual(['walkthrough', 'sale']);
    expect(find<HTMLInputElement>(`#${listId}-input`, container).value).toBe('');
    expect(settings.forum.threadFilterKeywords.value).toEqual(['walkthrough', 'sale']);
  });

  test('should add on Enter, without submitting the page', async () => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough'] });
    const container = mountList();
    const field = find<HTMLInputElement>(`#${listId}-input`, container);

    await type(container, 'sale');
    const enter = pressKey(field, 'Enter');

    expect(enter.defaultPrevented).toBe(true);
    expect(getValues(container)).toEqual(['walkthrough', 'sale']);
    expect(field.value).toBe('');
  });

  // The settings menu closes on an Escape nothing used (its default not prevented)
  test('should clear what was typed on Escape, adding nothing, and leave Escape alone once the field is empty', async () => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough'] });
    const container = mountList();
    const field = find<HTMLInputElement>(`#${listId}-input`, container);
    await type(container, 'sale');

    expect(pressKey(field, 'Escape').defaultPrevented).toBe(true);
    expect([field.value, getValues(container)]).toEqual(['', ['walkthrough']]);

    expect(pressKey(field, 'Escape').defaultPrevented).toBe(false);
  });

  test('should leave other keys to the field', () => {
    const container = mountList();
    expect(pressKey(find<HTMLInputElement>(`#${listId}-input`, container), 'a').defaultPrevented).toBe(false);
  });

  test.each([
    ['only spaces', '   ', ['walkthrough']],
    ['already listed', ' walkthrough ', ['walkthrough']],
    ['with spaces around it', '  sale ', ['walkthrough', 'sale']]
  ])('should trim a value %s, and not add it twice', async (_, typed, saved) => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough'] });
    const container = mountList();

    await type(container, typed);
    click(find('input[type="submit"]', container));

    expect(settings.forum.threadFilterKeywords.value).toEqual(saved);
    expect(find<HTMLInputElement>(`#${listId}-input`, container).value).toBe(typed.trim() === '' ? typed : '');
  });

  test('should add nothing when the field is empty, without submitting the page', () => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough'] });
    const container = mountList();

    const event = click(find('input[type="submit"]', container));

    expect(event.defaultPrevented).toBe(true);
    expect(getValues(container)).toEqual(['walkthrough']);
    expect(settings.forum.threadFilterKeywords.value).toEqual(['walkthrough']);
  });

  test('should remove the clicked value and save the rest', () => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough', 'sale', 'sale'] });
    const container = mountList();
    const removes = [...container.querySelectorAll('li a')];

    expect(removes).toHaveLength(3);
    const event = click(removes[1]);

    expect(event.defaultPrevented).toBe(true);
    expect(getValues(container)).toEqual(['walkthrough', 'sale']);
    expect(settings.forum.threadFilterKeywords.value).toEqual(['walkthrough', 'sale']);
  });

  // Its Remove goes with the value, so the focus goes to the next value's, the last one left, or the field
  test("should put the focus on the next value's Remove once one is removed, the new last one's, then on the field", async () => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough', 'sale', 'xbox'] });
    const container = mountList();
    const removes = () => [...container.querySelectorAll<HTMLElement>('li a')];

    await act(() => {
      click(removes()[2]);
    });
    expect(document.activeElement).toBe(removes()[1]);
    expect(getValues(container)).toEqual(['walkthrough', 'sale']);

    await act(() => {
      click(removes()[0]);
    });
    expect(document.activeElement).toBe(removes()[0]);
    expect(getValues(container)).toEqual(['sale']);

    await act(() => {
      click(removes()[0]);
    });
    expect(document.activeElement).toBe(find(`#${listId}-input`, container));
  });

  // Following another tab is the setting's own job (storage/setting.spec.ts): the row only shows what the setting holds
  test("should show the setting's values as they change", async () => {
    setSettings({ 'forum.threadFilterKeywords': ['walkthrough'] });
    const container = mountList();

    await act(() => {
      settings.forum.threadFilterKeywords.value = ['walkthrough', 'sale'];
    });

    expect(getValues(container)).toEqual(['walkthrough', 'sale']);
  });
});
