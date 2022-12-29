import * as fs from 'fs';
import { log } from 'missionlog';
import { Constants } from '../constants';
import { waitForElement } from '../scripts/helpers/wait';

const listen = async(): Promise<void> => {
  log.debug('Staff-Walkthrough-Improvements-Styles', 'Starting - listen');

  const iframe =  await waitForElement('#txtWalkthrough_ifr') as HTMLIFrameElement;
  const themeElement = await waitForElement('[data-theme]') as HTMLElement;
  const theme = themeElement.getAttribute('data-theme');
  
  iframe.addEventListener('load', async() => {
    log.debug('Staff-Walkthrough-Improvements-Styles', 'Starting - load event listener');

    const iframeDocument = iframe && iframe.contentDocument;

    const bodyEl = await waitForElement('#tinymce', iframeDocument) as HTMLElement;
    bodyEl.classList.add(Constants.Styles.root, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
    bodyEl.setAttribute('data-ta-x-theme', theme);

    log.debug('Staff-Walkthrough-Improvements-Styles', 'set iframe theme to', theme);
    
    const style = iframeDocument.createElement('style');
    style.innerHTML = fs.readFileSync('./dist/resources/tinymce/charcoal/content.css', 'utf8');
    iframeDocument.head.appendChild(style);

    const script = iframeDocument.createElement('script');
    script.innerHTML = `window.addEventListener('message', function(event) {
      document.body.setAttribute('data-ta-x-theme', event.data.theme);
    });`;
    iframeDocument.head.appendChild(script);

    iframe.removeEventListener('load', this);

    log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished - load event listener');
  });

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const theme = (mutation.target as HTMLElement).getAttribute('data-theme');

        log.debug('Staff-Walkthrough-Improvements-Styles', 'Started - mutation observer', theme);

        if (theme !== null && theme !== undefined) {
          iframe.contentWindow.postMessage({ theme: theme }, '*');
          document.body.setAttribute('data-ta-x-theme', theme);

          log.debug('Staff-Walkthrough-Improvements-Styles', 'set iframe theme to', theme);
          log.debug('Staff-Walkthrough-Improvements-Styles', 'Finished - mutation observer');
        } else {
          log.warn('Staff-Walkthrough-Improvements-Styles', 'Theme was null or undefined');
        }
      }
    });
  });
  
  observer.observe(themeElement, {
    attributes: true
  });

  document.body.setAttribute('data-ta-x-theme', theme);

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
