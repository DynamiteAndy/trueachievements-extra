import * as fs from 'fs';
import { Constants } from '../constants';
import { waitForElement } from '../scripts/helpers/wait';

const listen = async(): Promise<void> => {
  const themeElement = (await waitForElement('[data-theme]') as HTMLElement);
  const iframe =  (await waitForElement('#txtWalkthrough_ifr') as HTMLIFrameElement);
  
  iframe.addEventListener('load', async() => {
    const iframeDocument = iframe && iframe.contentDocument;

    const bodyEl = (await waitForElement('#tinymce', iframeDocument) as HTMLElement)
    bodyEl.classList.add(Constants.Styles.root, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
    bodyEl.setAttribute('data-ta-x-theme', themeElement.dataset.theme);
    
    const style = iframeDocument.createElement('style');
    style.innerHTML = fs.readFileSync('./dist/resources/tinymce/charcoal/content.css', 'utf8');
    iframeDocument.head.appendChild(style);

    const script = iframeDocument.createElement('script');
    script.innerHTML = `window.addEventListener('message', function(event) {
      document.body.setAttribute('data-ta-x-theme', event.data.theme);
    });`
    iframeDocument.head.appendChild(script);

    iframe.removeEventListener('load', this);
  });

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        iframe.contentWindow.postMessage({ theme: (mutation.target as HTMLElement).dataset.theme }, '*')
        document.body.setAttribute('data-ta-x-theme', (mutation.target as HTMLElement).dataset.theme);
      }
    });
  });
  
  observer.observe(themeElement, {
    attributes: true
  });

  document.body.setAttribute('data-ta-x-theme', themeElement.dataset.theme);
}

export const apply = async (): Promise<void> => {
  (await waitForElement('[href*="skin.min.css"]'), document.head);
  GM_addStyle(fs.readFileSync('./dist/resources/tinymce/charcoal/skin.css', 'utf8'));

  await listen();
};
