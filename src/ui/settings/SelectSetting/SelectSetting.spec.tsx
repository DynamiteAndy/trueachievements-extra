import { settings } from '@ta-x-storage';
import { changeSetting, find, mountInPage, renderElement, setSettings } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { SelectSetting } from './SelectSetting';

describe('SelectSetting', () => {
  const sortByOptions = [
    { value: 'product,game', text: 'Product' },
    { value: 'sale-price', text: 'Sale Price' },
    { value: 'completion-time', text: 'Completion Time' }
  ];
  const sortOrderOptions = [
    { value: 'asc', text: 'Ascending' },
    { value: 'desc', text: 'Descending' }
  ];

  test('should render a site dropdown with its style class', () => {
    const row = renderElement(
      <SelectSetting
        setting={settings.news.sales.autoSortByOrder}
        containerClasses="ta-x-hide-padding-top"
        options={sortOrderOptions}
      />
    );
    const select = find('select', row);

    expect([...row.classList]).toEqual(['frm-grp', 'frm-sel', 'ta-x-hide-padding-top', 'ta-x-select']);
    expect([...select.classList]).toEqual(['dropdown']);
    expect([select.id, select.name]).toEqual([
      'ta-x-news-sales-auto-sort-by-order',
      'ta-x-news-sales-auto-sort-by-order'
    ]);
    expect([...select.options].map((option) => [option.value, option.text])).toEqual([
      ['asc', 'Ascending'],
      ['desc', 'Descending']
    ]);
  });

  test('should show and save a single value', () => {
    setSettings({ 'news.sales.autoSortByOrder': 'desc' });
    const { container } = mountInPage(
      <SelectSetting setting={settings.news.sales.autoSortByOrder} options={sortOrderOptions} />
    );
    const select = find('select', container);

    expect(select.value).toBe('desc');

    changeSetting(select, 'asc');

    expect(settings.news.sales.autoSortByOrder.value).toBe('asc');
  });

  test('should show and save an array value, split by its separator', () => {
    setSettings({ 'news.sales.autoSortByValue': ['product', 'game'] });
    const { container } = mountInPage(
      <SelectSetting setting={settings.news.sales.autoSortByValue} options={sortByOptions} />
    );
    const select = find('select', container);

    expect(select.value).toBe('product,game');

    changeSetting(select, 'sale-price');

    expect(settings.news.sales.autoSortByValue.value).toEqual(['sale-price']);
  });

  test('should name the dropdown with its label, beside it, when given one', () => {
    const { container } = mountInPage(
      <SelectSetting setting={settings.news.sales.autoSortByValue} options={sortByOptions} label="Sort by" />
    );
    const label = find('label', container);

    expect([...label.classList]).toEqual(['ta-x-select-label']);
    expect(label.textContent).toBe('Sort by');
    expect(label.htmlFor).toBe('ta-x-news-sales-auto-sort-by-value');
    expect(label.nextElementSibling?.id).toBe('ta-x-news-sales-auto-sort-by-value');
  });

  test('should render no label when given none', () => {
    const { container } = mountInPage(
      <SelectSetting setting={settings.news.sales.autoSortByValue} options={sortByOptions} />
    );

    expect(container.querySelector('label')).toBeNull();
  });

  test('should render its helper text after the row when given one', () => {
    const { container } = mountInPage(
      <SelectSetting
        setting={settings.news.sales.autoSortByValue}
        options={sortByOptions}
        helperText="This option may not work on some tables."
      />
    );
    const helper = container.children[1];

    expect(container.children).toHaveLength(2);
    expect(helper.tagName).toBe('P');
    expect([...helper.classList]).toEqual(['ta-x-select-helper-text']);
    expect(helper.textContent).toBe('This option may not work on some tables.');
  });

  // Following another tab is the setting's own job (storage/setting.spec.ts): the row only shows what the setting holds
  test("should show the setting's value as it changes", async () => {
    setSettings({ 'news.sales.autoSortByOrder': 'asc' });
    const { container } = mountInPage(
      <SelectSetting setting={settings.news.sales.autoSortByOrder} options={sortOrderOptions} />
    );

    await act(() => {
      settings.news.sales.autoSortByOrder.value = 'desc';
    });

    expect(find('select', container).value).toBe('desc');
  });
});
