import { find, mountInPage, pressKey, renderElement, required } from '@ta-x-test';
import { act } from 'preact/test-utils';

import styles from '../styles';

import { CollapseButton } from './CollapseButton';

describe('ui/accordion/CollapseButton', () => {
  const mountWithContent = () => {
    const content = document.createElement('div');
    Object.defineProperty(content, 'scrollHeight', { configurable: true, get: () => 587 });
    document.body.append(content);
    const { root } = mountInPage(<CollapseButton class="ta-x-feature-collapse-icon" content={content} />);

    return { content, root, button: required(root.element) };
  };

  test('renders an open site button with the accordion and collapse button classes and its own, holding a chevron', () => {
    const button = renderElement(
      <CollapseButton class="ta-x-feature-collapse-icon" content={document.createElement('div')} />
    );

    expect(button.tagName).toBe('SPAN');
    expect([...button.classList]).toEqual([
      'button',
      'menubutton',
      'ta-x-feature-collapse-icon',
      styles.accordion,
      styles.collapseButton,
      'expanded'
    ]);
    expect(find('svg path', button).getAttribute('fill')).toBe('currentColor');
    // Still the site's span (see the component), made a keyboard button with a name, as it has no text
    expect(['role', 'tabindex', 'aria-expanded', 'aria-label'].map((name) => button.getAttribute(name))).toEqual([
      'button',
      '0',
      'true',
      'Show or hide the group'
    ]);
  });

  test("has only the site's and the accordion's classes when the feature gives it none", () => {
    const button = renderElement(<CollapseButton content={document.createElement('div')} />);

    expect([...button.classList]).toEqual([
      'button',
      'menubutton',
      styles.accordion,
      styles.collapseButton,
      'expanded'
    ]);
  });

  // Several on a page (each group, each sale table): each named for its own, and pointing at what it collapses
  test('is named for what it collapses, and controls its content, when given them', () => {
    const content = document.createElement('div');
    content.id = 'ta-x-collapsible-content-3';
    const button = renderElement(
      <CollapseButton class="ta-x-feature-collapse-icon" content={content} name="Fortnite" />
    );

    expect(button.getAttribute('aria-label')).toBe('Show or hide Fortnite');
    expect(button.getAttribute('aria-controls')).toBe('ta-x-collapsible-content-3');
  });

  test.each([
    { name: 'Enter', key: 'Enter' },
    { name: 'Space', key: ' ' }
  ])('collapses and expands with $name, as a button does, without the page taking the key', ({ key }) => {
    const { content, button } = mountWithContent();

    expect(pressKey(button, key).defaultPrevented).toBe(true);
    expect([button.getAttribute('aria-expanded'), content.style.maxHeight]).toEqual(['false', '0px']);

    pressKey(button, key);
    expect([button.getAttribute('aria-expanded'), content.style.maxHeight]).toEqual(['true', '587px']);
  });

  test('keeps the collapsed content out of reach of Tab and screen readers, and gives it back unmounted', async () => {
    const { content, root, button } = mountWithContent();
    expect(content.hasAttribute('inert')).toBe(false);

    await act(() => button.click());
    expect(content.hasAttribute('inert')).toBe(true);

    await act(() => root.unmount());
    expect(content.hasAttribute('inert')).toBe(false);
  });

  test("collapses and expands the content it's given, which it doesn't render", async () => {
    const { content, button } = mountWithContent();
    expect(content.style.maxHeight).toBe('');

    await act(() => button.click());
    expect(content.style.maxHeight).toBe('0px');
    expect(button.classList).not.toContain('expanded');

    await act(() => button.click());
    expect(content.style.maxHeight).toBe('587px');
    await act(() => {
      content.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'max-height' }));
    });
    expect(content.style.maxHeight).toBe('');
    expect(button.classList).toContain('expanded');
  });
});
