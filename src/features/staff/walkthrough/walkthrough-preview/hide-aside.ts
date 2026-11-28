import { waitForElement } from '@ta-x-page';

// The preview's side column, which both filling it and hiding it look for
export const asideSelector = '.page aside';

// The preview without its side column: the site's no-aside class on main and its parent widens the content, and the
// aside goes. Used when "Fill In Side Column" is off, and when it's on but there's nothing to show. Each part
// is skipped if the site's markup isn't there, without stopping the other.
export const hideAside = async (): Promise<void> => {
  const main = await waitForElement('.page main');
  if (main) {
    main.parentElement?.classList.add('no-aside');
    main.classList.add('no-aside');
  }

  const aside = await waitForElement(asideSelector);
  aside?.remove();
};
