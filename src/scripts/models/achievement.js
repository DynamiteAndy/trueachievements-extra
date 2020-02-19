const parse = require('../helpers/parse');
const memoizeFetch = require('../helpers/memoize-fetch');

const { GamerUnlock } = require('./gamer');
const { broadcast } = require('../components/events');

class Achievement {
  constructor(opts) {
    opts = Object.assign({}, opts);

    this.name = opts.name;
    this.description = opts.description;
    this.link = opts.link ? opts.link.split('?')[0] : opts.link;
    this.taScore = parse.stringToInt(opts.taScore);
    this.gamerScore = parse.stringToInt(opts.gamerScore);
    this.winners = opts.winners;
  }

  getWinnersByPage(page) {
    const lastPage = this.winners.pages.length - 1;
    const pageValue = page.toLowerCase() === 'first'
      ? 0
      : page.toLowerCase() === 'last'
        ? lastPage
        : page;

    if (pageValue > lastPage)
      return new Promise(resolve => resolve([]));

    if (this.winners.pages[pageValue] && this.winners.pages[pageValue].length !== 0)
      return new Promise(resolve => resolve(this.winners.pages[pageValue]));

    return new Promise((resolve, reject) => memoizeFetch(`${this.winners.link}?page=${pageValue}`)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const recentWinners = [...doc.querySelectorAll('#oAchievementGamerList tbody tr:not(.NoDrop)')].map(el => {
            const gamer = el.querySelector('.gamervwide a');

            return new GamerUnlock({
              name: gamer.innerText,
              link: gamer.href,
              achievement: this,
              unlockDate: parse.stringToDate(el.lastElementChild.innerText),
              unlockOffline: el.querySelector('[title="This achievement was earned offline."]') !== null
            });
          });

          broadcast('achievementWinnersByPage:retrieved', undefined, recentWinners);

          this.winners.pages[pageValue] = recentWinners;
          return resolve(this.winners.pages[pageValue]);
        }).catch(err => {
          console.log('opps');
        }));
  }
}

module.exports = {
  Achievement
};
