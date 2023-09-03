import { gameForums, getUrlProperties, Cache } from '@ta-x-globals';

export const changeToDefaultThread = (): void => {
  if (!gameForums.gameForumsDefaultThread) {
    return;
  }

  const anchor = document.querySelector(
    `.link-tabs a[href$=${gameForums.gameForumsDefaultThreadValue}]`
  ) as HTMLAnchorElement;

  const url = getUrlProperties(window.location.href, ['pathname']);

  if (anchor && url !== Cache.gameForumsDefaultThreadPathName) {
    Cache.gameForumsDefaultThreadPathName = getUrlProperties(window.location.href, ['pathname']);

    if (new URLSearchParams(window.location.search).get('type') === gameForums.gameForumsDefaultThreadValue) {
      return;
    }

    if (!anchor.classList.contains('selected')) {
      anchor.click();
    }
  }
};

export default { changeToDefaultThread };
