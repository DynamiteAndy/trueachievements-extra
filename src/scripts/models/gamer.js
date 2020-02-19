const parse = require('../helpers/parse');
const memoizeFetch = require('../helpers/memoize-fetch');

const { broadcast } = require('../components/events');

class Gamer {
  constructor(opts) {
    opts = Object.assign({}, opts);

    this.name = opts.name;
    this.link = opts.link ? opts.link.split('?')[0] : opts.link;
    this.image = opts.image;
    this.taScore = parse.stringToInt(opts.taScore);
    this.gamerScore = parse.stringToInt(opts.gamerScore);
    this.online = opts.online;
    this.games = Object.assign({}, opts.games);
  }

  getDetails(opts) {
    opts = Object.assign({}, opts);

    return new Promise((resolve, reject) => memoizeFetch(this.link)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const panelHeader = doc.querySelector('.panel-header.gamer');

          this.name = panelHeader.querySelector('.title a').innerText;
          this.online = panelHeader.querySelector('.gamer .tile-indicator') !== null;
          this.image = panelHeader.querySelector('img.tile').src;

          const taScoreIcon = panelHeader.querySelector('.scores i.ta-emb');
          const gamerScoreIcon = panelHeader.querySelector('.scores i.ta-gs');

          if (taScoreIcon) this.taScore = parse.stringToInt(taScoreIcon.parentNode.innerText);
          if (gamerScoreIcon) this.gamerScore = parse.stringToInt(gamerScoreIcon.parentNode.innerText);

          broadcast('gamerDetails:retrieved', opts.context, this);

          return resolve(this);
        }).catch(err => {
          console.log('opps');
        }));
  }
}

class GamerUnlock extends Gamer {
  constructor(opts) {
    opts = Object.assign({}, opts);

    super(opts);

    this.achievement = opts.achievement;
    this.unlockDate = parse.stringToDate(opts.unlockDate);
    this.unlockOffline = opts.unlockOffline;
  }
}

class LeaderboardGamer extends Gamer {
  constructor(opts) {
    opts = Object.assign({}, opts);

    super(opts);

    this.link = opts.link;
    this.achievementLink = opts.achievementLink;
    this.compareLink = opts.compareLink;
    this.score = opts.score;
  }

  getDetails(opts) {
    if (this.link) return super.getDetails(opts);

    return new Promise((resolve, reject) => memoizeFetch(this.achievementLink || this.compareLink)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const gamerProfile = doc.querySelector('.panel-header.p h3 a, .comparison th:nth-child(3) .gamertag');

          this.link = gamerProfile.href;

          return this;
        })
        .then(() => resolve(super.getDetails(opts)))
        .catch(err => {
          console.log('opps');
        }));
  }
}

module.exports = {
  Gamer,
  GamerUnlock,
  LeaderboardGamer
};
