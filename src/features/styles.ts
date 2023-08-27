import styles from '@ta-x-scss/index.scss';
import { Constants } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';

export default async (): Promise<void> => {
  if (!(await waitForElement('body'))) {
    return;
  }

  document.body.classList.add(Constants.Styles.root);
  GM_addStyle(styles);
};
