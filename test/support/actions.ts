import { act } from 'preact/test-utils';

import type { Mock } from 'vitest';

import { find } from './elements';

// Clicks an element as a user does (a bubbling, cancelable click), inside act() so Preact renders the result before
// the test goes on. Returns the event, to check whether a handler stopped its default action (a link or a submit)
export const click = (element: Element): MouseEvent => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  // Not awaited: act() renders a synchronous callback's result before it returns (its promise is already resolved),
  // so this stays synchronous for callers that use what it returns
  void act(() => {
    element.dispatchEvent(event);
  });

  return event;
};

// Presses a key on an element as a user does (a bubbling, cancelable keydown), inside act() as `click` is. Returns the
// event, to check whether a handler stopped its default action (Space scrolling the page)
export const pressKey = (
  element: Element,
  key: string,
  // Shift, Alt, Ctrl or Cmd held down with it
  modifiers: Pick<KeyboardEventInit, 'shiftKey' | 'altKey' | 'ctrlKey' | 'metaKey'> = {}
): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { key, ...modifiers, bubbles: true, cancelable: true });
  void act(() => {
    element.dispatchEvent(event);
  });

  return event;
};

// Types `value` into the ask form inside `container` (an ask loader's, or a guide site's links) and clicks its button,
// as a user does. The container may be a lookup that found nothing: the test fails saying so
export const submitAsk = (container: ParentNode | null | undefined, value: string): MouseEvent => {
  find<HTMLInputElement>('input[type="text"]', container).value = value;

  return click(find('input[type="submit"]', container));
};

// The tab the next GM_openInTab opens (test/mocks/tampermonkey.ts opens a stand-in), to check it's closed again, or
// to close it as the user would (its `onclose`, set by the code under test)
export const openTab = (): { close: Mock<() => void>; onclose?: () => void } => {
  const tab = { close: vi.fn<() => void>() };
  vi.mocked(GM_openInTab).mockReturnValueOnce(tab as unknown as ReturnType<typeof GM_openInTab>);

  return tab;
};
