import * as taxPage from '@ta-x-page';
import { settings } from '@ta-x-storage';
import { expectAppliesLive, find, setHtml, setSettings, tick } from '@ta-x-test';

import styles from './styles';

import hoverableParagraphs from '.';

describe('game/walkthrough/hoverable-paragraphs', () => {
  const page = (): HTMLElement => find('#divWalkthroughPagePreview .walkthroughpage');
  // Runs it, stopping it when the test ends
  const run = async (): Promise<void> => {
    onTestFinished(hoverableParagraphs());
    await tick();
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/game-walkthrough/gears-of-war-4-page-1.html', {
      url: 'https://www.trueachievements.com/game/Gears-of-War-4/walkthrough/1'
    });
  });

  test("should mark the walkthrough page's text, for its paragraphs to highlight on hover", async () => {
    setSettings({ 'game.walkthrough.hoverableParagraphs': true });

    await run();

    expect(page().classList).toContain(styles.hoverableParagraphs);
  });

  test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
    setSettings({ 'game.walkthrough.hoverableParagraphs': false });
    await run();

    await expectAppliesLive(settings.game.walkthrough.hoverableParagraphs);
  });

  test("should do nothing, without throwing, on a walkthrough's hub (it has no page)", async () => {
    setSettings({ 'game.walkthrough.hoverableParagraphs': true });
    find('#divWalkthroughPagePreview').remove();
    vi.spyOn(taxPage, 'waitForElement').mockResolvedValueOnce(null);

    await run();

    expect(document.querySelector(`.${styles.hoverableParagraphs}`)).toBeNull();
  });
});
