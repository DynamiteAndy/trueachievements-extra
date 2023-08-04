import { Constants } from '@ta-x-globals';
import pubSub from './pub-sub';

const switchTab = (selectedTab: HTMLElement) => {
  if (selectedTab.classList.contains(Constants.Styles.Components.Tab.tabSelected)) return;

  const parentTabContainer = selectedTab.closest(`.${Constants.Styles.Components.Tab.featureJs}`);
  const prevSelected = parentTabContainer.querySelector(
    `.${Constants.Styles.Components.Tab.tabSelected}`
  ) as HTMLElement;
  const prevContent = parentTabContainer.querySelector('[data-tab-visible]') as HTMLElement;
  const nextSelected = parentTabContainer.querySelector(selectedTab.getAttribute('data-tab-id'));

  if (prevSelected && prevContent) {
    prevSelected.classList.toggle(Constants.Styles.Components.Tab.tabSelected);
    prevContent.removeAttribute('data-tab-visible');
  }

  selectedTab.classList.toggle(Constants.Styles.Components.Tab.tabSelected);
  nextSelected.setAttribute('data-tab-visible', '');
};

const listen = (): void => {
  let container: HTMLElement;
  let isDown = false;
  let startX: number;
  let scrollLeft: number;
  let momentumID: number;
  let velX = 0;

  const mouseUpEvent = () => {
    isDown = false;
    container.classList.remove(Constants.Styles.Components.Tab.tabScroll);
    beginMomentumTracking();
    removeListeners();
  };

  const mouseLeaveEvent = () => {
    isDown = false;
    container.classList.remove(Constants.Styles.Components.Tab.tabScroll);

    removeListeners();
  };

  const mouseMoveEvent = (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 3;
    const prevScrollLeft = container.scrollLeft;

    container.scrollLeft = scrollLeft - walk;
    velX = container.scrollLeft - prevScrollLeft;
  };

  const wheelEvent = () => {
    cancelMomentumTracking();
  };

  const beginMomentumTracking = () => {
    cancelMomentumTracking();

    momentumID = requestAnimationFrame(momentumLoop);
  };

  const cancelMomentumTracking = () => {
    cancelAnimationFrame(momentumID);
  };

  const momentumLoop = () => {
    container.scrollLeft += velX;
    velX *= 0.95;

    if (Math.abs(velX) > 0.5) {
      momentumID = requestAnimationFrame(momentumLoop);
    }
  };

  const removeListeners = () => {
    container.removeEventListener('mouseup', mouseUpEvent);
    container.removeEventListener('mouseleave', mouseLeaveEvent);
    container.removeEventListener('mousemove', mouseMoveEvent);
    container.removeEventListener('wheel', wheelEvent);
  };

  document.addEventListener('mousedown', (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) return;
    container = e.target.closest(`.${Constants.Styles.Components.Tab.tabLinkContainer}`);

    if (!container) return;

    isDown = true;
    container.classList.add(Constants.Styles.Components.Tab.tabScroll);
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    cancelMomentumTracking();

    container.addEventListener('mouseup', mouseUpEvent);
    container.addEventListener('mouseleave', mouseLeaveEvent);
    container.addEventListener('mousemove', mouseMoveEvent);
    container.addEventListener('wheel', wheelEvent);
  });
};

export const tabs = (): void => {
  document.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains(Constants.Styles.Components.Tab.tabLink)) return;

    switchTab(target);
  });

  pubSub.subscribe('tabs:set', (tab: HTMLElement) => {
    switchTab(tab);
  });

  listen();
};

export default tabs;
