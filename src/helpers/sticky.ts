import { Constants, stickyHeader } from '@ta-x-globals';
import { StickyElementOptions } from '@ta-x-types';
import { waitForElement } from '../utilities/html-element-util';

const stickyNavBarEnabled = stickyHeader.enabled;
const stickyNavBarStuck = stickyHeader.remainStuck;
let stickyNavBarElement: HTMLElement;

const setStickyNavElement = async () => {
  if (stickyNavBarElement) return;

  stickyNavBarElement = stickyNavBarEnabled
    ? await waitForElement(`.${Constants.Styles.StickyHeader.featureJs}`)
    : await waitForElement('.header');
};

export const applyStickyElementStyle = async (
  variableProperty: string,
  stickyElement: HTMLElement,
  containerElement: HTMLElement,
  opts: StickyElementOptions = {}
): Promise<void> => {
  await setStickyNavElement();

  let addAnimation: string;
  let removeAnimation = [
    Constants.Styles.Animations.yShow,
    Constants.Styles.Animations.yHide,
    Constants.Styles.Animations.yHideNoTransition
  ];
  let topStylePx = opts.paddingFromTop || 0;

  const containerTop = containerElement.getBoundingClientRect().top;

  if (containerTop > 0) {
    topStylePx = 0;
  } else {
    topStylePx += opts.isRelativeToParent ? 0 : Math.abs(containerTop);

    if (stickyNavBarEnabled) {
      topStylePx += stickyNavBarElement.offsetHeight;

      if (!stickyNavBarElement.classList.contains(Constants.Styles.Animations.yShow) && !stickyNavBarStuck) {
        addAnimation = opts.noTransitionStyle
          ? Constants.Styles.Animations.yHideNoTransition
          : Constants.Styles.Animations.yHide;
        removeAnimation = [Constants.Styles.Animations.yShow];
      } else {
        addAnimation = Constants.Styles.Animations.yShow;
        removeAnimation = [Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition];
      }
    }
  }

  document.documentElement.style.setProperty(variableProperty, `${topStylePx}px`);

  stickyElement.classList.remove(...removeAnimation);
  if (addAnimation) stickyElement.classList.add(addAnimation);
};

export default { applyStickyElementStyle };
