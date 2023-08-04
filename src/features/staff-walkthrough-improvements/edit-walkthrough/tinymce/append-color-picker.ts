import JsColor from '@eastdesire/jscolor';
import { waitForElement } from '@ta-x-utilities';

const listen = (): void => {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.type !== 'childList') return;
      if (!(mutation.target instanceof HTMLElement)) return;
      if (!mutation.addedNodes || mutation.addedNodes.length === 0) return;

      const tablePropertyModal = [...mutation.addedNodes].find(
        (node: HTMLElement) => node.ariaLabel === 'Table properties'
      );

      if (!tablePropertyModal || !(tablePropertyModal instanceof HTMLElement)) return;

      ([...tablePropertyModal.querySelectorAll('.mce-colorbox input')] as HTMLInputElement[]).forEach(
        (el: HTMLInputElement) => {
          el.parentElement.style.left = '201px';

          const container = el.closest('.mce-container-body');
          const colorPickerOpts = {
            zIndex: 65536
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any;

          if (container) {
            const label = container.querySelector('label');

            if (label) {
              if (label.innerText === 'Border color') {
                colorPickerOpts.format = 'hexa';
              }
            }
          }

          new JsColor(el, colorPickerOpts);
        }
      );

      observer.disconnect();
    });
  });

  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
  });
};

export const appendColorPicker = async (): Promise<void> => {
  const iframe = (await waitForElement('#txtWalkthrough_ifr')) as HTMLIFrameElement;

  iframe.addEventListener('load', async () => {
    listen();

    iframe.removeEventListener('load', this);
  });
};

export default { appendColorPicker };
