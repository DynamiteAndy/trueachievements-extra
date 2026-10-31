import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { find, mountForTest, pressKey, renderElement, required } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { settingsMenuOpen } from '../settings-menu-open';

import { SettingsMenuButton } from './SettingsMenuButton';

describe('SettingsMenuButton', () => {
  test('should render the wrench with its hook class, as a keyboard button named Settings', () => {
    const button = renderElement(<SettingsMenuButton />);

    expect([...button.classList]).toEqual(['js-ta-x-settings-menu-wrench', 'ta-x-settings-menu-wrench', 'gamer-page']);
    expect(
      ['role', 'tabindex', 'aria-label', 'aria-haspopup', 'aria-expanded'].map((name) => button.getAttribute(name))
    ).toEqual(['button', '0', 'Settings', 'dialog', 'false']);
    expect(find('svg path', button).getAttribute('d')).toBe(faWrench.icon[4]);
  });

  test('should open the menu when clicked, becoming active and expanded', async () => {
    const { element } = mountForTest(<SettingsMenuButton />, document.createElement('div'));

    await act(() => required(element).click());

    expect(settingsMenuOpen.value).toBe(true);
    expect(required(element).classList).toContain('active');
    expect(required(element).getAttribute('aria-expanded')).toBe('true');
  });

  test('should close the menu when clicked again, as the site gamer toggle does', async () => {
    const { element } = mountForTest(<SettingsMenuButton />, document.createElement('div'));

    await act(() => required(element).click());
    await act(() => required(element).click());

    expect(settingsMenuOpen.value).toBe(false);
    expect(required(element).classList).not.toContain('active');
    expect(required(element).getAttribute('aria-expanded')).toBe('false');
  });

  test.each([
    { name: 'Enter', key: 'Enter' },
    { name: 'Space', key: ' ' }
  ])('should open and close the menu with $name, as a button does, without the page taking the key', ({ key }) => {
    const wrench = required(mountForTest(<SettingsMenuButton />, document.createElement('div')).element);

    expect(pressKey(wrench, key).defaultPrevented).toBe(true);
    expect(settingsMenuOpen.value).toBe(true);

    pressKey(wrench, key);
    expect(settingsMenuOpen.value).toBe(false);
  });

  test('should leave other keys alone', () => {
    const wrench = required(mountForTest(<SettingsMenuButton />, document.createElement('div')).element);

    expect(pressKey(wrench, 'a').defaultPrevented).toBe(false);
    expect(settingsMenuOpen.value).toBe(false);
  });
});
