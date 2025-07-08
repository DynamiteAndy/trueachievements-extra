import pubSub from '../pub-sub';
import attributes from './attributes';
import styles from './styles';

const getCurrentlySelectedTabAndContent = (
  tabOrContent: HTMLElement
): { parent: HTMLElement; tab: HTMLElement; content: HTMLElement } => {
  const parentTabContainer = tabOrContent.closest(`.${styles.jsTabs}`) as HTMLElement;
  const selectedTab = parentTabContainer.querySelector(`.${styles.tabSelected}`) as HTMLElement;
  const selectedContent = parentTabContainer.querySelector(`[${attributes.visibleTab}]`) as HTMLElement;

  return { parent: parentTabContainer, tab: selectedTab, content: selectedContent };
};

const getTabAndContent = (
  tabOrContent: HTMLElement
): { parent: HTMLElement; tab: HTMLElement; content: HTMLElement; isSelected: boolean } => {
  const parentTabContainer = tabOrContent.closest(`.${styles.jsTabs}`) as HTMLElement;
  let tab: HTMLElement;
  let content: HTMLElement;

  if (tabOrContent.classList.contains(styles.jsTabsLink)) {
    tab = tabOrContent;
    content = parentTabContainer.querySelector(tab.getAttribute(attributes.tabId)) as HTMLElement;
  } else if (tabOrContent.classList.contains(styles.jsTabsContent)) {
    content = tabOrContent;
    tab = parentTabContainer.querySelector(`[${attributes.tabId}="#${content.getAttribute('id')}"]`) as HTMLElement;
  } else {
    tab = tabOrContent.closest(`.${styles.jsTabsLink}`);
    content = tabOrContent.closest(`.${styles.jsTabsContent}`);

    if (tab) {
      content = parentTabContainer.querySelector(tab.getAttribute(attributes.tabId)) as HTMLElement;
    } else {
      tab = parentTabContainer.querySelector(`[${attributes.tabId}="#${content.getAttribute('id')}"]`) as HTMLElement;
    }
  }

  return {
    parent: parentTabContainer,
    tab: tab,
    content: content,
    isSelected: tab.classList.contains(styles.tabSelected)
  };
};

const getFallbackTab = (tab: HTMLElement) => {
  const siblingProps = ['previousElementSibling', 'nextElementSibling'];

  for (const prop of siblingProps) {
    let checkTab = tab[prop] as HTMLElement;

    if (checkTab) {
      while (checkTab) {
        if (!checkTab.classList.contains('ta-x-hide')) {
          return checkTab;
        }
        
        checkTab = checkTab[prop];
      }
    }
  }
};

const switchTab = (selectedTab: HTMLElement) => {
  if (selectedTab.classList.contains(styles.tabSelected)) {
    return;
  }

  const currentTabAndContent = getCurrentlySelectedTabAndContent(selectedTab);
  const nextSelected = getTabAndContent(selectedTab);

  if (currentTabAndContent.tab && currentTabAndContent.content) {
    currentTabAndContent.tab.classList.toggle(styles.tabSelected);
    currentTabAndContent.content.removeAttribute(attributes.visibleTab);
  }

  nextSelected.tab.classList.toggle(styles.tabSelected);
  nextSelected.content.setAttribute(attributes.visibleTab, '');
};

const hideTab = (tabToHide: HTMLElement) => {
  const tabAndContent = getTabAndContent(tabToHide);
  const fallbackTab = getFallbackTab(tabAndContent.tab);

  if (fallbackTab) {
    if (tabAndContent.isSelected) {
      switchTab(fallbackTab);
    }

    tabAndContent.tab.classList.add('ta-x-hide');
    tabAndContent.content.classList.add('ta-x-hide');
  } else {
    tabAndContent.parent.classList.add('ta-x-hide');
    tabAndContent.tab.classList.add('ta-x-hide');
    tabAndContent.content.classList.add('ta-x-hide');

    if (tabAndContent.isSelected) {
      tabAndContent.tab.classList.toggle(styles.tabSelected);
      tabAndContent.content.removeAttribute(attributes.visibleTab);
    }
  }
};

const deleteTab = (tabToDelete: HTMLElement) => {
  const tabAndContent = getTabAndContent(tabToDelete);
  const fallbackTab = getFallbackTab(tabAndContent.tab);

  if (fallbackTab) {
    if (tabAndContent.isSelected) {
      switchTab(fallbackTab);
    }

    tabAndContent.content.remove();
    tabAndContent.tab.remove();
  } else {
    tabAndContent.parent.classList.add('ta-x-hide');

    tabAndContent.content.remove();
    tabAndContent.tab.remove();
  }
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

    container.classList.remove(styles.tabScroll);

    beginMomentumTracking();
    removeListeners();
  };

  const mouseLeaveEvent = () => {
    isDown = false;
    container.classList.remove(styles.tabScroll);

    removeListeners();
  };

  const mouseMoveEvent = (e: MouseEvent) => {
    if (!isDown) {
      return;
    }

    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 3;
    const prevScrollLeft = container.scrollLeft;

    container.scrollLeft = scrollLeft - walk;
    velX = container.scrollLeft - prevScrollLeft;
  };

  const wheelEvent = () => cancelMomentumTracking();

  const beginMomentumTracking = () => {
    cancelMomentumTracking();

    momentumID = requestAnimationFrame(momentumLoop);
  };

  const cancelMomentumTracking = () => cancelAnimationFrame(momentumID);

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
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    container = e.target.closest(`.${styles.jsTabsLinkContainer}`);
    if (!container) {
      return;
    }

    isDown = true;
    container.classList.add(styles.tabScroll);
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
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.classList.contains(styles.jsTabsLink)) {
      return;
    }

    switchTab(target);
  });

  pubSub.subscribe('tabs:set', switchTab);
  pubSub.subscribe('tabs:hide', hideTab);
  pubSub.subscribe('tabs:delete', deleteTab);

  listen();
};

export default tabs;
 