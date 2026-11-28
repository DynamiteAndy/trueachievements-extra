import { classNames } from '@ta-x-lib';
import { clickOnEnterOrSpace, Wrench } from '@ta-x-ui';

import { settingsMenuOpen, toggleSettingsMenu } from '../settings-menu-open';
import styles from '../styles';

// The wrench in the site's header that opens and closes the settings menu, active while it's open. A div as the site's
// header styles it (with its gamer-page class), made a keyboard button
export const SettingsMenuButton = () => (
  <div
    class={classNames(styles.jsWrench, styles.wrench, 'gamer-page', settingsMenuOpen.value && 'active')}
    role="button"
    tabIndex={0}
    aria-haspopup="dialog"
    aria-expanded={settingsMenuOpen.value}
    aria-label="Settings"
    onClick={toggleSettingsMenu}
    onKeyDown={clickOnEnterOrSpace}
  >
    <Wrench />
  </div>
);
