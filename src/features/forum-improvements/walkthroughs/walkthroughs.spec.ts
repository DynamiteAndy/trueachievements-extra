import { createInnerTextSpies, setHtml } from '@ta-x-test';
import { ForumRegex } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import walkthroughs from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('forum-improvements/walkthroughs', () => {
  const createTitleElement = (title: string): HTMLElement => {
    const titleElement = document.createElement('p');
    const node = document.createTextNode(title);
    titleElement.appendChild(node);

    return titleElement;
  };

  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not on viewBoard with boardId or viewThread with threadId', async () => {
    vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValueOnce(false);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should not run if on viewBoard with boardId and boardId is not expected', async () => {
    await setHtml('@ta-x-test-views/empty.html', {
      url: 'https://www.trueachievements.com/forum/viewboard.aspx?messageboardid=1433'
    });

    vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on viewBoard with boardId and boardId is expected', async () => {
    await setHtml('@ta-x-test-views/empty.html', {
      url: 'https://www.trueachievements.com/forum/viewboard.aspx?messageboardid=1431'
    });

    vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(true);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValue(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should not run if on viewThread and page title heading does not load', async () => {
    vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(false);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValue(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should not run if on viewThread and page title heading is not walkthroughs', async () => {
    const titleElement = createTitleElement('Not the right title');

    createInnerTextSpies();
    vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(false);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValue(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should run if on viewThread and page title heading is walkthroughs', async () => {
    const titleElement = createTitleElement('Walkthroughs');

    createInnerTextSpies();
    vi.spyOn(ForumRegex.Test, 'viewBoardUrlWithBoardId').mockReturnValue(false);
    vi.spyOn(ForumRegex.Test, 'viewThreadUrlWithThreadId').mockReturnValue(true);
    vi.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(titleElement);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await walkthroughs();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
