import { createInnerTextSpies, setHtml } from '@ta-x-jest';
import { ForumRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import walkthroughs from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

describe('forum-improvements/walkthroughs', () => {
  const createTitleElement = (title: string): HTMLElement => {
    const titleElement = document.createElement('p');
    const node = document.createTextNode(title);
    titleElement.appendChild(node);

    return titleElement;
  };

  beforeEach(async () => {
    await setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not on viewBoard with boardId or viewThread with threadId', async () => {
    jest.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValueOnce(false);
    jest.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if on viewBoard with boardId and boardId is not expected', async () => {
    await setHtml('@ta-x-jest-views/empty.html', {
      url: 'https://www.trueachievements.com/forum/viewboard.aspx?messageboardid=1433'
    });

    jest.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(true);
    jest.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on viewBoard with boardId and boardId is expected', async () => {
    await setHtml('@ta-x-jest-views/empty.html', {
      url: 'https://www.trueachievements.com/forum/viewboard.aspx?messageboardid=1431'
    });

    jest.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(true);
    jest.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValue(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if on viewThread and page title heading does not load', async () => {
    jest.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(false);
    jest.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValue(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if on viewThread and page title heading is not walkthroughs', async () => {
    const titleElement = createTitleElement('Not the right title');

    createInnerTextSpies();
    jest.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(false);
    jest.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValue(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should run if on viewThread and page title heading is walkthroughs', async () => {
    const titleElement = createTitleElement('Walkthroughs');

    createInnerTextSpies();
    jest.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(false);
    jest.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValue(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
