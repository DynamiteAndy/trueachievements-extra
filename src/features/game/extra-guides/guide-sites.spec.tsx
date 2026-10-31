import { renderElement } from '@ta-x-test';

import { guideSites } from './guide-sites';

describe('game/extra-guides/guide-sites', () => {
  // Each site's copy links its home page by its domain (where its solutions came from: each guide-site spec checks it)
  test.each([
    ['xbox-achievements', 'https://www.xboxachievements.com/', 'XboxAchievements.com'],
    ['playstation-trophies', 'https://www.playstationtrophies.org/', 'PlaystationTrophies.org'],
    ['gamertag-nation', 'https://www.gamertagnation.com/', 'GamertagNation.com']
  ])('%s should link %s as %s in its copy', (id, url, domain) => {
    const site = guideSites.find((guideSite) => guideSite.id === id);
    const links = [site?.summary, site?.askInformation].map((copy) =>
      [...renderElement(<div>{copy}</div>).querySelectorAll('a')].map((link) => [
        link.getAttribute('href'),
        link.textContent,
        link.target,
        link.rel
      ])
    );

    expect(links).toEqual([
      [[url, domain, '_blank', 'noopener noreferrer']],
      [[url, domain, '_blank', 'noopener noreferrer']]
    ]);
  });
});
