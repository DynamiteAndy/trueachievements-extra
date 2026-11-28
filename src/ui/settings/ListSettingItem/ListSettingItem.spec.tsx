import { click, find, mountInPage, pressKey, renderElement, required } from '@ta-x-test';

import { ListSettingItem } from './ListSettingItem';

describe('ListSettingItem', () => {
  test('should render the value and a Remove link', () => {
    const item = renderElement(<ListSettingItem value="walkthrough" onRemove={() => {}} />);

    expect(item.tagName).toBe('LI');
    expect(find('div > p', item).textContent).toBe('walkthrough');
    expect(find('a', item).getAttribute('href')).toBe('#');
    expect(find('a', item).textContent).toBe('Remove');
    // Read on its own in a list of links, it says which value it removes
    expect(find('a', item).getAttribute('aria-label')).toBe('Remove walkthrough');
  });

  test('should remove the value on a click, without following the link', () => {
    const onRemove = vi.fn();
    const item = required(mountInPage(<ListSettingItem value="walkthrough" onRemove={onRemove} />).root.element);

    expect(click(find('a', item)).defaultPrevented).toBe(true);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  test.each([
    { name: 'Enter', key: 'Enter' },
    { name: 'Space', key: ' ' }
  ])('should remove the value with $name, as a button', ({ key }) => {
    const onRemove = vi.fn();
    const item = required(mountInPage(<ListSettingItem value="walkthrough" onRemove={onRemove} />).root.element);

    expect(find('a', item).getAttribute('role')).toBe('button');
    expect(pressKey(find('a', item), key).defaultPrevented).toBe(true);
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
