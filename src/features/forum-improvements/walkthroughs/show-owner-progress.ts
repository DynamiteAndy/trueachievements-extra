import { Cache, Constants, forumImprovements, ForumRegex, GamesRegex, SentencesRegex } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import { memoizeFetch } from '@ta-x-helpers';
import html from './walkthroughs.hbs';

// Elements -------
let extensionBody: HTMLElement;
let askForWalkthroughBody: HTMLElement;

const applyBody = async(): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const asideColumn = await waitForElement('.main aside');
  const firstSection = await waitForElement('section:not(.smallpanel)', asideColumn);

  asideColumn.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`),
  firstSection);

  extensionBody = asideColumn.querySelector(`.${Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`);
  askForWalkthroughBody = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`);

  getAchievementWalkthroughUrl();
};

const listen = (): void => {
  const button = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.buttonJs}`);
  const input = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.inputJs}`) as HTMLInputElement;

  button.addEventListener('click', async (e: Event) => {
    if (!(e.target instanceof HTMLElement)) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      if (input.value === '') return;
      if (!GamesRegex.Test.walkthroughUrl(input.value)) return;

      toggleAskForWalkthrough();
      await getOwnerProgress(input.value);
    } catch {
      return;
    }
  });
};

const getAchievementWalkthroughUrl = async(): Promise<void> => {
  const cachedWalkthroughUrls = Cache.walkthroughForumOwnerProgressUrl;
  const threadId = new URLSearchParams(window.location.search).get('tid');
  let url = threadId ? cachedWalkthroughUrls.get(threadId) : null;
  
  if (!url) {
    const posts = await waitForElement('.posts');

    ([...posts.querySelectorAll('li .body')] as HTMLElement[]).forEach((el: HTMLElement) => {
      if (url) return;
      if (SentencesRegex.discussWalkthrough.test(el.textContent) ||
        SentencesRegex.walkthroughPublished.test(el.textContent)) {
          const anchor = el.querySelector('a') as HTMLAnchorElement;

          if (anchor && GamesRegex.Test.gameUrl(anchor.href)) {
            url = anchor.href;
            
            if (!url.endsWith('/walkthrough')) {
              url += '/walkthrough';
            }
            
            return;
          }
        }
    });

    if (!url) {
      toggleAskForWalkthrough();
      return;
    }
  }

  getOwnerProgress(url);
};

const getOwnerProgress = async(url: string): Promise<void> => {
  let walkthroughResponse = await memoizeFetch(url);
  let walkthroughDocument = new DOMParser().parseFromString(walkthroughResponse, 'text/html');
  const walkthroughEditors = walkthroughDocument.querySelector('.editors dl');
  const extensionArticle = extensionBody.querySelector('article');

  if (walkthroughEditors) {
    const gamersInvolved = getGamersInvolved(walkthroughEditors);
    const walkthroughEditorsWrapper = document.createElement('div');
    walkthroughEditorsWrapper.classList.add(Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorWrapperStyle);
    walkthroughEditorsWrapper.append(...gamersInvolved);

    extensionArticle.appendChild(walkthroughEditorsWrapper);

    const thanks = walkthroughDocument.querySelector('aside .thanks');

    if (thanks) {
      extensionArticle.appendChild(thanks);
    }
  } else {
    let walkthroughProgress = walkthroughDocument.querySelector('aside section .walthroughprogress');

    if (walkthroughProgress === null) {
      url = `${url}?sbonly=1`;
      walkthroughResponse = await memoizeFetch(url);
      walkthroughDocument = new DOMParser().parseFromString(walkthroughResponse, 'text/html');
      walkthroughProgress = walkthroughDocument.querySelector('aside section .walthroughprogress');

      if (walkthroughProgress === null) {
        toggleAskForWalkthrough();
        return;
      }
    }

    extensionArticle.appendChild(walkthroughProgress);

    const fillCircleScript = extensionArticle.querySelector('script');
   
    if (fillCircleScript) {
      eval(fillCircleScript.innerHTML);
    }
  }

  const cachedWalkthroughUrls = Cache.walkthroughForumOwnerProgressUrl;
  const threadId = new URLSearchParams(window.location.search).get('tid');

  if (threadId && !cachedWalkthroughUrls.has(threadId)) {
    cachedWalkthroughUrls.set(threadId, url);
    Cache.walkthroughForumOwnerProgressUrl = cachedWalkthroughUrls;
  }

  extensionBody.setAttribute('data-ta-x-loaded', 'true');
};

const getGamersInvolved = (walkthroughEditors: Element): HTMLElement[] => {
  let currentRow = (document.createElement('div') as HTMLElement);
  currentRow.classList.add(Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorRowStyle);

  return ([...walkthroughEditors.childNodes] as HTMLElement[]).reduce((rows, current, index, currentArray) => {
    if (current.tagName === 'DT') {
      if (currentRow.childElementCount > 0) {
        rows.push(currentRow);

        currentRow = document.createElement('div');
        currentRow.classList.add(Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorRowStyle);
      }

      currentRow.innerHTML = current.innerHTML;
    } else if (current.tagName === 'DD') {
      currentRow.innerHTML += `<div class="${Constants.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorStyle}">${current.innerHTML}</div>`;
    }

    if (index === currentArray.length -1 && currentRow.childElementCount > 0) {
      rows.push(currentRow);
    }

    return rows;
  }, []);
};

const toggleAskForWalkthrough = (): void => {
  askForWalkthroughBody.classList.toggle('ta-x-hide');

  if (!askForWalkthroughBody.classList.contains('ta-x-hide')) {
    extensionBody.setAttribute('data-ta-x-loaded', 'true');
  } else {
    extensionBody.removeAttribute('data-ta-x-loaded');
  }
};

export default async (): Promise<void> => {
  if (!forumImprovements.walkthroughs.showOwnerProgress) return;
  if (!ForumRegex.Test.viewThreadUrlWithThreadId()) return;

  const pageTitle = await waitForElement('#oMessageThread .pagetitle') as HTMLElement;
  if (!pageTitle || pageTitle.innerText.toLowerCase() !== 'walkthroughs') return;

  await applyBody();
  listen();
};
