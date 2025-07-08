import { Constants, miscellaneousImprovements } from '@ta-x-globals';
import { httpIntercept, intersectionObserver, mutationObserver, resizeObserver } from '@ta-x-services';
import { allConcurrently, waitForElement } from '@ta-x-utilities';

const navGamerSelector = `.nav-gamer:not(.${Constants.Styles.SettingsMenu.featureJs})`;
const settingsMenuSelector = `.${Constants.Styles.SettingsMenu.featureJs}`;
const searchElementSelector = '#divtxtSearchContainer';
const menuSelectors = [navGamerSelector, settingsMenuSelector];

let extensionBody: HTMLElement;
let fakeElement: HTMLElement;
let previousScrollTop: number;
let previousMenuOpen: boolean;
let searchOpen: boolean;
let atTop: boolean;

const atTopOfPage = (): boolean => window.pageYOffset <= extensionBody.offsetTop;

const applyBody = async (): Promise<void> => {
  extensionBody = await waitForElement('header');

  fakeElement = document.createElement('div');
  fakeElement.style.height = `${extensionBody.offsetHeight}px`;

  extensionBody.parentNode.insertBefore(fakeElement, extensionBody);
  extensionBody.classList.add(Constants.Styles.StickyHeader.featureJs, Constants.Styles.StickyHeader.featureStyle);

  document.documentElement.style.setProperty(
    Constants.Styles.Variables.StickyHeader.height,
    `${extensionBody.offsetHeight}px`
  );

  atTop = atTopOfPage();

  if (!miscellaneousImprovements.stickyHeader.remainStuck && !atTop) {
    extensionBody.classList.add(Constants.Styles.Animations.yHideNoTransition);
  }
};

const listen = async (): Promise<void> => {
  if (miscellaneousImprovements.stickyHeader.remainStuck) {
    return;
  }

  previousMenuOpen = false;
  searchOpen = false;

  window.addEventListener('scroll', () => {
    const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (atTop) {
      extensionBody.classList.remove(Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition);
    } else if (!searchOpen && !previousMenuOpen) {
      if (previousScrollTop > currentScrollTop) {
        extensionBody.classList.remove(
          Constants.Styles.Animations.yHide,
          Constants.Styles.Animations.yHideNoTransition
        );
        extensionBody.classList.add(Constants.Styles.Animations.yShow);
      } else if (previousScrollTop < currentScrollTop) {
        extensionBody.classList.remove(Constants.Styles.Animations.yShow);
        extensionBody.classList.add(Constants.Styles.Animations.yHide);
      }
    }

    previousScrollTop = currentScrollTop;
  });

  resizeObserver.observe(extensionBody, () => {
    if (fakeElement.style.height !== `${extensionBody.offsetHeight}px`) {
      fakeElement.style.height = `${extensionBody.offsetHeight}px`;
    }
  });

  intersectionObserver.observe(fakeElement, (entry) => {
    atTop = entry.isIntersecting;
  });

  mutationObserver.onMutation(
    searchElementSelector,
    (target) => {
      searchOpen = target.style.display === 'inline';
    },
    { attributeFilter: ['style'] }
  );

  const handleMenuMutation = (target: HTMLElement): void => {
    previousMenuOpen = target.classList.contains('open');
  };

  menuSelectors.forEach((selector) => {
    mutationObserver.onMutation(selector, handleMenuMutation, { attributeFilter: ['class'] });
  });

  // The site loads this markup via an ajax request that can fail (e.g. a 403), in which case
  // these never appear and `waitForElement` would otherwise sit out its full timeout waiting
  // for markup that's never coming -- so bail as soon as that request's response says it
  // failed, rather than waiting to find out the hard way. Read best-effort either way: a
  // timeout/abort resolves `null`/`[]`, leaving the initial `false` defaults set above.
  const gamerHeaderFailed = new AbortController();

  // There's only ever one gamerheader request, so once we've seen its response -- success or
  // failure -- there's nothing left to watch for; `once: true` unregisters automatically as
  // soon as the listener stops returning `false` (i.e. as soon as it's not some other request).
  const stopWatchingForGamerHeaderResponse = httpIntercept.onResponse(
    ({ req, res }) => {
      if (new URL(req.url).pathname !== '/true-api/livehtml/gamerheader') {
        return false;
      }

      if (!res.ok) {
        gamerHeaderFailed.abort();
      }
    },
    { once: true }
  );

  const waitForGamerHeaderElement = (selector: string, root?: Document | Element): Promise<HTMLElement | null> =>
    waitForElement(selector, root, undefined, gamerHeaderFailed.signal);

  const [navGamer, taxSettingsMenu, searchElement] = await allConcurrently('sticky-header-elements', [
    { name: 'nav-gamer', task: () => waitForGamerHeaderElement(navGamerSelector) },
    { name: 'settings-menu', task: () => waitForGamerHeaderElement(settingsMenuSelector) },
    { name: 'search-element', task: () => waitForElement(searchElementSelector, extensionBody) }
  ]);

  // Safety net for the case the gamerheader response never arrives at all -- already
  // unregistered by then in the normal case, and unregistering twice is a harmless no-op.
  stopWatchingForGamerHeaderResponse();

  previousMenuOpen = Boolean(navGamer?.classList.contains('open') || taxSettingsMenu?.classList.contains('open'));
  searchOpen = searchElement?.style.display === 'inline';
};

export default async (): Promise<void> => {
  if (!miscellaneousImprovements.stickyHeader.enabled) {
    return;
  }

  await applyBody();
  await listen();
};
