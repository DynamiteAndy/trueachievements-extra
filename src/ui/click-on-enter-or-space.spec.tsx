import { mountInPage, pressKey, required } from '@ta-x-test';

import { clickOnEnterOrSpace } from './click-on-enter-or-space';

// The rules every control using it keeps (TabLink, CollapseButton, the settings menu's wrench…): their own specs
// check only that their element takes it
describe('ui/click-on-enter-or-space', () => {
  test.each([
    { name: 'Enter', key: 'Enter', modifiers: {}, clicked: true },
    { name: 'Space', key: ' ', modifiers: {}, clicked: true },
    { name: 'another key', key: 'a', modifiers: {}, clicked: false },
    { name: 'Enter with Alt', key: 'Enter', modifiers: { altKey: true }, clicked: false },
    { name: 'Enter with Ctrl', key: 'Enter', modifiers: { ctrlKey: true }, clicked: false },
    { name: 'Enter with Cmd', key: 'Enter', modifiers: { metaKey: true }, clicked: false }
  ])('$name: clicked and kept from the page, $clicked', ({ key, modifiers, clicked }) => {
    const onClick = vi.fn();
    const control = required(
      mountInPage(<span role="button" tabIndex={0} onClick={onClick} onKeyDown={clickOnEnterOrSpace} />).root.element
    );

    expect(pressKey(control, key, modifiers).defaultPrevented).toBe(clicked);
    expect(onClick).toHaveBeenCalledTimes(clicked ? 1 : 0);
  });
});
