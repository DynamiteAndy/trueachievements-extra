import { log } from 'missionlog';
import config from '../config';
import { Constants } from '../constants';
import { toBool } from './helpers/parse';
import { waitForElement } from './helpers/wait';

// Elements -------
let extensionBody: HTMLElement;
let previousScrollTop: number;

const atTopOfPage = (): boolean => window.pageYOffset <= extensionBody.offsetTop;

const applyBody = async(): Promise<void> => {
  log.debug('Sticky-Header', 'Starting - applyBody');
  
  extensionBody = await waitForElement('header');
  
  const extensionParent = extensionBody.parentNode;
  const fakeElement = document.createElement('div');
  fakeElement.style.height = `${extensionBody.offsetHeight}px`;

  extensionParent.insertBefore(fakeElement, extensionBody);

  extensionBody.classList.add(Constants.Styles.StickyHeader.featureJs, Constants.Styles.StickyHeader.featureStyle);

  document.documentElement.style.setProperty(Constants.Styles.Variables.StickyHeader.height, `${extensionBody.offsetHeight}px`);

  if (!atTopOfPage()) {
    extensionBody.classList.add(Constants.Styles.Animations.yHideNoTransition);
  }

  log.debug('Sticky-Header', 'Finished - applyBody');
};

const listen = async(): Promise<void> => {
  log.debug('Sticky-Header', 'Starting - listen');

  const navGamer = await waitForElement(`.nav-gamer:not(.${Constants.Styles.SettingsMenu.featureJs})`);
  const taxSettingsMenu = await waitForElement(`.${Constants.Styles.SettingsMenu.featureJs}`);
  let prevState = navGamer.classList.contains('open') || taxSettingsMenu.classList.contains('open');

  window.addEventListener('scroll', () => {
    const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (atTopOfPage()) {
      extensionBody.classList.remove(Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition);
    } else {
      const searchElement = extensionBody.querySelector('#divtxtSearchContainer') as HTMLElement;

      if (searchElement.style.display !== 'inline' && !toBool(extensionBody.dataset.menuOpen)) {
        if (previousScrollTop > currentScrollTop) {
          extensionBody.classList.remove(Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition);
          extensionBody.classList.add(Constants.Styles.Animations.yShow);
        } else if (previousScrollTop < currentScrollTop) {
          extensionBody.classList.remove(Constants.Styles.Animations.yShow);
          extensionBody.classList.add(Constants.Styles.Animations.yHide);
        }
      }
    }

    previousScrollTop = currentScrollTop;
  });

  const observer = new MutationObserver((mutations: MutationRecord[]) => { 
      mutations.forEach(({ target, attributeName }) => {
        const htmlTarget = (target as HTMLElement);

          if (attributeName === 'class') {
              const currentState = htmlTarget.classList.contains('open');
              
              if (prevState !== currentState) {
                prevState = currentState;
                extensionBody.setAttribute('data-menu-open', currentState.toString());
              }
          }
      });
  });

  observer.observe(navGamer, {
    attributes : true,
    attributeFilter : ['style', 'class']
   });

   observer.observe(taxSettingsMenu, {
    attributes : true,
    attributeFilter : ['style', 'class']
   });

   log.debug('Sticky-Header', 'Finished - listen');
};

export default async(): Promise<void> => {
  if (!config.stickyHeader.enabled) return;

  log.debug('Sticky-Header', 'Starting');
  
  await applyBody();
  await listen();

  log.debug('Sticky-Header', 'Finished');
};
