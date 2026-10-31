import { find, mountInPage, renderElement, useFakeTimers } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { Accordion } from './Accordion';

describe('Accordion', () => {
  const render = () => {
    const { container } = mountInPage(
      <Accordion title="My Threads" contentClasses="t-settings">
        <p>Setting</p>
      </Accordion>
    );

    const [header, content] = [...container.children] as HTMLElement[];
    Object.defineProperty(content, 'scrollHeight', { configurable: true, get: () => 67 });

    return { header, content };
  };

  const transitionEnd = (content: HTMLElement) =>
    act(() => {
      content.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'max-height' }));
    });

  // Its content's height cap has a fallback timer, faked so that none runs on past its test
  beforeEach(() => {
    useFakeTimers();
  });

  test('should render a collapsed header, then its content', () => {
    const header = renderElement(
      <Accordion title="My Threads" contentClasses="t-settings">
        <p>Setting</p>
      </Accordion>
    );
    const content = header.nextElementSibling as HTMLElement;

    // A real button, not a submit (the site's form wraps the page), so the browser gives it Enter and Space
    expect([header.tagName, header.getAttribute('type')]).toEqual(['BUTTON', 'button']);
    expect([...header.classList]).toEqual(['ta-x-accordion']);
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(header.getAttribute('aria-controls')).toBe(content.id);
    expect(content.id).toMatch(/^ta-x-accordion-content-\d+$/);
    expect(find('span', header).textContent).toBe('My Threads');
    expect(find('svg path', header).getAttribute('fill')).toBe('currentColor');
    expect([...content.classList]).toEqual(['ta-x-accordion-content', 't-settings']);
    expect(content.style.maxHeight).toBe('0px');
    expect(content.innerHTML).toBe('<p>Setting</p>');
  });

  // Two sections can hold rows named alike (each game page's Collapsible Groups), so the content says whose it is
  test('should make its content a group named by its header, each its own', () => {
    const first = render();
    const second = render();

    expect([first.content, second.content].map((content) => content.getAttribute('role'))).toEqual(['group', 'group']);
    expect(first.header.id).toMatch(/^ta-x-accordion-header-\d+$/);
    expect(first.header.id).not.toBe(second.header.id);
    expect([first.content, second.content].map((content) => content.getAttribute('aria-labelledby'))).toEqual([
      first.header.id,
      second.header.id
    ]);
  });

  test('should give each its own content id', () => {
    const first = render();
    const second = render();

    expect(first.content.id).not.toBe(second.content.id);
    expect([first.header, second.header].map((header) => header.getAttribute('aria-controls'))).toEqual([
      first.content.id,
      second.content.id
    ]);
  });

  test('should say whether it is open, and keep closed content out of reach of Tab and screen readers', async () => {
    const { header, content } = render();
    expect(content.hasAttribute('inert')).toBe(true);

    await act(() => header.click());
    expect(header.getAttribute('aria-expanded')).toBe('true');
    expect(content.hasAttribute('inert')).toBe(false);

    await act(() => header.click());
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(content.hasAttribute('inert')).toBe(true);
  });

  test('should open to its content height, then drop the cap so the content can grow', async () => {
    const { header, content } = render();

    await act(() => header.click());
    expect(header.classList).toContain('expanded');
    expect(content.style.maxHeight).toBe('67px');

    await transitionEnd(content);
    expect(content.style.maxHeight).toBe('');
  });

  test('should drop the cap even when no transition end comes', async () => {
    const { header, content } = render();

    await act(() => header.click());
    vi.advanceTimersByTime(600);

    expect(content.style.maxHeight).toBe('');
  });

  test('should close from its open height', async () => {
    const { header, content } = render();
    await act(() => header.click());
    await transitionEnd(content);

    await act(() => header.click());

    expect(header.classList).not.toContain('expanded');
    expect(content.style.maxHeight).toBe('0px');
  });

  test('should stay closed when closed while still opening', async () => {
    const { header, content } = render();

    await act(() => header.click());
    await act(() => header.click());
    vi.advanceTimersByTime(600);
    await transitionEnd(content);

    expect(content.style.maxHeight).toBe('0px');
  });
});
