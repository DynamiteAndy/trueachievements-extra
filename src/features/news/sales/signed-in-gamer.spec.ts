import * as taxPage from '@ta-x-page';
import { find, setHtml } from '@ta-x-test';

import { signedInGamer } from './signed-in-gamer';

describe('news/sales/signed-in-gamer', () => {
  beforeEach(() => {
    // A sale article with the signed-in header's gamer link, as captured live
    setHtml('@ta-x-test-views/sale-article/owned-picks.html', {
      url: 'https://www.trueachievements.com/news/xbox-sales-september-24-2026'
    });
  });

  test("should give the signed-in gamer's id and gamer page", async () => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');

    expect(await signedInGamer()).toEqual({
      gamerId: '52877',
      gamerPage: 'https://www.trueachievements.com/gamer/Dynamite+Andy'
    });
  });

  test('should give null when no gamer is signed in, without waiting for a gamer link', async () => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('');
    const waitSpy = vi.spyOn(taxPage, 'waitForElement');

    expect(await signedInGamer()).toBeNull();
    expect(waitSpy).not.toHaveBeenCalled();
  });

  // The wait is mocked, so the spec doesn't sit out its timeout
  test('should give null when the header never has a gamer link', async () => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    find('nav').remove();
    vi.spyOn(taxPage, 'waitForElement').mockResolvedValue(null);

    expect(await signedInGamer()).toBeNull();
  });

  test("should give null when the header's link isn't a gamer page", async () => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValue('GamerID=52877');
    find('nav a.gamer-page').setAttribute('href', '/forum/viewthreads.aspx');

    expect(await signedInGamer()).toBeNull();
  });
});
