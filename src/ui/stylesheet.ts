import { bodyReady } from '@ta-x-page';
import styles from '@ta-x-scss/index.scss';

import { rootClass } from './constants';

// The sheet goes in at once, so nothing shows unstyled; our root class goes on <body> once there is one
export const stylesheet = async (): Promise<void> => {
  GM_addStyle(styles);
  (await bodyReady()).classList.add(rootClass);
};
