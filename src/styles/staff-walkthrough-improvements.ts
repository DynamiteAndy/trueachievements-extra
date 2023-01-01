import * as fs from 'fs';
import { log } from 'missionlog';
import { Constants } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import config from '../config';

const listen = async(): Promise<void> => {
  log.debug('Staff-Walkthrough-Improvements-Styles', 'Starting - listen');

  const iframe =  await waitForElement('#txtWalkthrough_ifr') as HTMLIFrameElement;
  const globalThemeElement = await waitForElement('[data-theme]') as HTMLElement;
  const tinymceThemeElement = await waitForElement(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
  let theme: string;

  if (config.staffWalkthroughImprovements.tinymceTheme === null) {
    theme = globalThemeElement.getAttribute('data-theme');
    log.warn('Staff-Walkthrough-Improvements-Styles', 'No tinymce theme has been set, using site theme');
  } else {
    theme = config.staffWalkthroughImprovements.tinymceTheme;
  }
  
  iframe.addEventListener('load', async() => {
    log.debug('Staff-Walkthrough-Improvements-Styles', 'Starting - load event listener');

    const iframeDocument = iframe && iframe.contentDocument;

    const bodyEl = await waitForElement('#tinymce', iframeDocument) as HTMLElement;
    bodyEl.classList.add(Constants.Styles.root, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
    bodyEl.setAttribute('data-ta-x-tinymce-theme', theme);

    log.debug('Staff-Walkthrough-Improvements-Styles', 'set iframe theme to', theme);
    
    const style = iframeDocument.createElement('style');
    style.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-style';
    style.innerHTML = fs.readFileSync('./dist/resources/tinymce/charcoal/content.css', 'utf8');
    iframeDocument.head.appendChild(style);

    const script = iframeDocument.createElement('script');
    script.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-script';
    script.innerHTML = `window.addEventListener('message', function(event) {
      console.log(event);
      if (!event || !event.data || event.data.theme === null || event.data.theme === undefined) return;
      document.body.setAttribute('data-ta-x-tinymce-theme', event.data.theme);
    });`;
    iframeDocument.head.appendChild(script);

    iframe.removeEventListener('load', this);

    log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished - load event listener');
  });

  let preventMutation = false;
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    if (preventMutation) {
      preventMutation = false;
      return;
    }

    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.type === 'attributes') {
        let theme: string;
        let setby: string;
        if (mutation.attributeName === 'data-theme') {
          theme = (mutation.target as HTMLElement).getAttribute('data-theme');
          setby = 'data-theme';
          preventMutation = true;
          tinymceThemeElement.setAttribute('data-ta-x-tinymce-theme', theme === 'dark' ? theme : '');
        } else if (mutation.attributeName === 'data-ta-x-tinymce-theme') {
          theme = (mutation.target as HTMLElement).getAttribute('data-ta-x-tinymce-theme');
          setby = 'data-ta-x-tinymce-theme';
        } else {
          return;
        }

        log.debug('Staff-Walkthrough-Improvements-Styles', 'Started - mutation observer', theme, 'set by', setby);

        if (theme !== null && theme !== undefined) {
          iframe.contentWindow.postMessage({ theme: theme }, '*');

          log.debug('Staff-Walkthrough-Improvements-Styles', 'set iframe theme to', theme);
          log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished - mutation observer');
        } else {
          log.warn('Staff-Walkthrough-Improvements-Styles', 'Theme was null or undefined');
        }
      }
    });
  });
  
  observer.observe(globalThemeElement, {
    attributes: true
  });

  observer.observe(tinymceThemeElement, {
    attributes: true
  });

  log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished - listen');
};

export default  async (): Promise<void> => {
  log.debug('Staff-Walkthrough-Improvements-Styles', 'Starting');

  if ((await waitForElement('[href*="skin.min.css"]'), document.head)) {
    GM_addStyle(fs.readFileSync('./dist/resources/tinymce/charcoal/skin.css', 'utf8'));

    await listen();

    log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished');
  } else {
    log.error('Staff-Walkthrough-Improvements-Styles', 'Failed to add, The body element was not found');
  }
};
