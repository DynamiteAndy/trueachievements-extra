import { addPageScript } from '@ta-x-page';

// The bits of the site's jQuery the dropdown toggle uses
interface JQueryElements {
  length: number;
  [index: number]: HTMLElement;
  parent: () => JQueryElements;
  children: (selector: string) => JQueryElements;
  css: { (property: string): string; (property: string, value: string | number): void };
  position: () => { top: number; left: number };
  height: () => number;
  slideUp: (duration: number) => void;
  slideDown: (duration: number) => void;
}
type JQuery = (target: Element | string | JQueryElements | HTMLElement) => JQueryElements;
type DropdownToggle = (button: HTMLElement) => void;

// A page function (page/page-script.ts): gives the page the site's DropdownButtonPanel_Toggle where it lacks it.
// The emoji picker's dropdown button calls it, and only some of the site's pages define it (achievement pages don't).
// Checked in the page, since the userscript's sandbox can't see the site's own
export const defineDropdownToggle = (): void => {
  const page = window as Window & { $?: JQuery; DropdownButtonPanel_Toggle?: DropdownToggle };

  if (typeof page.DropdownButtonPanel_Toggle === 'function') {
    return;
  }

  // The site's own, as it ships it
  page.DropdownButtonPanel_Toggle = (button) => {
    // The site's jQuery, when clicked
    const { $ } = page;
    if (!$) {
      return;
    }
    const toggle = $(button);
    const panel = $(toggle.parent().children('div')[0]);

    if (panel.css('display') === 'none') {
      const panels = $('.dropdownbuttonpanel');

      for (let i = 0; i < panels.length; i++) {
        if ($(panels[i]).css('display') !== 'none') {
          $(panels[i]).slideUp(100);
        }
      }

      panel.css('top', toggle.position().top + toggle.height() + 11);
      panel.css('left', toggle.position().left + 2);
      panel.css('position', 'absolute');
      panel.slideDown(100);
    } else {
      panel.slideUp(100);
    }
  };
};

// Once per page, before the first picker, whether its reply box was there at the start or added later
export const ensureDropdownButtonPanelToggle = (): void => {
  if (document.getElementById('ta-x-emojis-dropdown-toggle')) {
    return;
  }

  addPageScript('ta-x-emojis-dropdown-toggle', defineDropdownToggle);
};
