import { bodyReady } from '@ta-x-page';

import styles from './styles';

// TA Pro hides its ads (`.dyn-lb { display: none }`) but not the sale table rows an ad script adds them in, which the
// site's table sort then gathers at the top as empty strips. Marks the page so our styles hide those rows too, using
// the same check the site uses before hiding its ads.
export default async (): Promise<void> => {
  if (!(localStorage.getItem('lh_sub') ?? '').includes('"key":"1_0')) {
    return;
  }

  (await bodyReady()).classList.add(styles.salesAdFree);
};
