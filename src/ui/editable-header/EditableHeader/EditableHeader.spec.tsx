import { click, find, mountInPage, pressKey, renderElement, required } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { Pencil } from '../../icons';
import styles from '../styles';

import { EditableHeader } from './EditableHeader';

describe('ui/editable-header/EditableHeader', () => {
  test('renders its label and its icon button, with its title', () => {
    const header = renderElement(
      <EditableHeader label="Linked walkthrough" icon={<Pencil />} actionTitle="Change it" onAction={() => undefined} />
    );

    expect(header.className).toBe(styles.editableHeader);
    expect(find(':scope > span', header).textContent).toBe('Linked walkthrough');
    expect(find(':scope > a', header).getAttribute('title')).toBe('Change it');
    expect(find(':scope > a svg', header).tagName.toLowerCase()).toBe('svg');
  });

  test('calls onAction on a click, without following the link', () => {
    const onAction = vi.fn();
    const header = required(
      mountInPage(<EditableHeader label="Linked" icon={<Pencil />} actionTitle="Change" onAction={onAction} />).root
        .element
    );

    expect(click(find(':scope > a', header)).defaultPrevented).toBe(true);
    expect(onAction).toHaveBeenCalledExactlyOnceWith();
  });

  test.each([
    { name: 'Enter', key: 'Enter' },
    { name: 'Space', key: ' ' }
  ])('calls onAction with $name, as a button', ({ key }) => {
    const onAction = vi.fn();
    const header = required(
      mountInPage(<EditableHeader label="Linked" icon={<Pencil />} actionTitle="Change" onAction={onAction} />).root
        .element
    );
    const button = find(':scope > a', header);

    expect(button.getAttribute('role')).toBe('button');
    expect(pressKey(button, key).defaultPrevented).toBe(true);
    expect(onAction).toHaveBeenCalledExactlyOnceWith();
  });

  // Pressed, it goes while its field shows; once back, the keyboard carries on from it rather than from the page's top
  test('takes the focus back when it shows again after being pressed', async () => {
    const { root } = mountInPage(
      <EditableHeader label="Linked" icon={<Pencil />} actionTitle="Change" onAction={() => undefined} />
    );
    const header = required(root.element);

    click(find(':scope > a', header));
    await act(() => root.render(<EditableHeader label="Linked" icon={<Pencil />} actionTitle="Change" />));
    expect(header.querySelector('a')).toBeNull();
    await act(() =>
      root.render(<EditableHeader label="Linked" icon={<Pencil />} actionTitle="Change" onAction={() => undefined} />)
    );

    expect(document.activeElement).toBe(find(':scope > a', header));
  });

  test('shows no button without onAction', () => {
    const header = renderElement(<EditableHeader label="Linked" icon={<Pencil />} actionTitle="Change" />);

    expect(header.querySelector('a')).toBeNull();
  });
});
