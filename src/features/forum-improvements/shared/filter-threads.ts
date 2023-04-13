import { Constants } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';

let listenApplied = false;

const listen = () => {
  document.addEventListener('click', (e: MouseEvent): void => {
    if (!(e.target instanceof HTMLElement)) return;
    if (!e.target.classList.contains(Constants.Styles.ForumImprovements.filterThreadsUnhideJs)) return;

    e.preventDefault();
    e.stopPropagation();

    (e.target.closest('li') as HTMLLIElement).setAttribute('data-thread-hidden', 'false');
  });

  listenApplied = true;
};

export const applyThreadFilters = async(filters: string[]) => {
  if (!filters.length) return;

  const board = await waitForElement('main .view-board, main .messageboard-index');
  ([...board.querySelectorAll('li:not(.header)')] as HTMLElement[]).forEach((thread: HTMLElement) => {
    const threadTitleAnchor = (thread.querySelector('.topic a, .read a') as HTMLAnchorElement);
    let activeFilter: string = null;

    filters.forEach((filter: string) => {
      if (activeFilter != null) return;
      if (!threadTitleAnchor.innerText.trim().toLowerCase().includes(filter.toLowerCase())) return;

      activeFilter = filter;
    });

    if (!activeFilter) return;

    const threadLi = threadTitleAnchor.closest('li') as HTMLLIElement;
    const threadTitleParagraph = document.createElement('p') as HTMLParagraphElement;
    threadTitleParagraph.innerText = `Hidden by filter "${activeFilter}"`;
    threadTitleParagraph.classList.add(Constants.Styles.ForumImprovements.filterThreadsTitleStyle);
    (threadTitleAnchor.closest('div') as HTMLDivElement).appendChild(threadTitleParagraph);
    
    const threadTitleUnhide = document.createElement('a') as HTMLAnchorElement;
    threadTitleUnhide.innerText = 'Unhide';
    threadTitleUnhide.classList.add(Constants.Styles.ForumImprovements.filterThreadsUnhideStyle, Constants.Styles.ForumImprovements.filterThreadsUnhideJs);

    threadLi.setAttribute('data-thread-hidden', 'true');
    threadLi.appendChild(threadTitleUnhide);

    if (!listenApplied) {
      listen();
    }
  });
};

export default { applyThreadFilters };