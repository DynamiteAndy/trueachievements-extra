const parse = require('../helpers/parse');
const memoizeFetch = require('../helpers/memoize-fetch');

const { Achievement } = require('./achievement');
const { broadcast } = require('../components/events');

const getInformation = (el, isBaseGame) => {
  const informationEl = isBaseGame
    ? document.querySelector('.main aside section.gameinfo dl')
    : [...document.querySelectorAll('.main aside section dl.game-info')].map(el => el.closest('article'));

  const scanDl = (dl) => {
    const information = {};
    let lastProperty;

    if (!dl) return information;

    for (let i = 0; i < dl.childNodes.length; i++) {
      const child = dl.children[i];

      if (child.tagName.toLowerCase() === 'dt') {
        lastProperty = child.innerText.replace(':', '').replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
          if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
      } else if (child.tagName.toLowerCase() === 'dd') {
        switch (lastProperty) {
          case 'publishers':
          case 'publisher':
            information.publisher = [...child.querySelectorAll('a')].map(el => ({ name: el.innerText, link: el.href }));
            break;

          case 'developer':
          case 'developers':
            information.developer = [...child.querySelectorAll('a')].map(el => ({ name: el.innerText, link: el.href }));
            break;

          case 'release':
          case 'releaseDate':
            information.release = child.innerText;
            break;

          case 'genre':
          case 'genres':
            information.genre = [...child.querySelectorAll('a')].map(el => ({ name: el.innerText, link: el.href }));
            break;

          case 'size':
            information.size = child.innerText;
        }
      }
    }

    return information;
  };

  if (isBaseGame) {
    return scanDl(informationEl);
  } else {
    for (let i = 0; i < informationEl.length; i++) {
      const dlcTitle = informationEl[i].querySelector('.dlc-title a');

      if (!dlcTitle || dlcTitle.pathname.toLowerCase() !== el.pathname.toLowerCase()) continue;

      const dl = informationEl[i].querySelector('dl');

      return scanDl(dl);
    }
  }
};

const getScoreDetails = (el) => ({
  taScore: parseInt(el.querySelector('.scores span:nth-child(1)').innerText.replace(/,/g, ''), 10),
  gamerScore: parseInt(el.querySelector('.scores span:nth-child(2)').innerText.replace(/,/g, ''), 10)
});

const getStatDetails = (el, isBaseGame) => {
  const stats = {};

  const gameRating = el.querySelector('.stats span[title$="votes"], .stats span:nth-child(2)');
  const playedByDetails = el.querySelector('.stats a[title*="Played by"], .stats span:nth-child(2)');
  const completedByDetails = el.querySelector('.stats a[title*="Completed by"], .stats span:nth-child(3)');
  const completionEstimate = el.querySelector('.stats span[title="Estimated time to unlock all achievements"], .stats span:nth-child(4)');

  stats.rating = gameRating ? gameRating.innerText : null;
  stats.completionEstimate = completionEstimate ? completionEstimate.innerText : null;

  if (playedByDetails) {
    const playedByTotal = parseInt(playedByDetails.innerText.replace(/,/g, ''), 10);
    stats.playedBy = {
      total: playedByTotal
    };

    if (isBaseGame) {
      stats.playedBy.link = playedByDetails.href;
      stats.playedBy.pages = new Array(playedByTotal > 100 ? Math.trunc((playedByTotal) / 100) + 1 : 1);
    }
  } else {
    stats.playedBy = null;
  }

  if (completedByDetails) {
    const completedByTotal = parseInt(completedByDetails.innerText.replace(/,/g, ''), 10);
    stats.completedBy = {
      total: completedByTotal
    };

    if (isBaseGame) {
      stats.playedBy.link = completedByDetails.href;
      stats.playedBy.pages = new Array(completedByTotal > 100 ? Math.trunc((completedByTotal) / 100) + 1 : 1);
    }
  } else {
    stats.completedBy = null;
  }

  return stats;
};

const getAchievementDetails = (el) => {
  const totalWinners = parseInt(el.querySelector('.progress-bar').dataset.af.split(' ')[0].replace(/,/g, ''), 10);
  const title = el.querySelector('.title');
  const description = el.querySelector('p');

  return new Achievement({
    name: title.innerText,
    description: description.innerText,
    link: title.href,
    taScore: title.dataset.af.replace(/,/g, ''),
    gamerScore: description.dataset.bf.split(' ')[0],
    winners: {
      total: totalWinners,
      link: `${title.href.split('?')[0]}/gamers`,
      pages: new Array(totalWinners > 50 ? Math.trunc((totalWinners) / 50) + 1 : 1)
    }
  });
};

const getBaseAchievements = (doc) => {
  const baseAchievementPanel = doc.querySelector('ul.ach-panels');
  return [...baseAchievementPanel.querySelectorAll('li')].map(li => getAchievementDetails(li));
};

const getDLCAchievements = (el) => {
  const dlcAchievementPanel = [...el.parentNode.children][[...el.parentNode.children].indexOf(el) + 1];
  return [...dlcAchievementPanel.querySelectorAll('li')].map(li => getAchievementDetails(li));
};

class Game {
  constructor(opts) {
    opts = Object.assign({}, opts);

    this.name = opts.name;
    this.link = opts.link ? opts.link.split('?')[0] : opts.link;
    this.taScore = parse.stringToInt(opts.taScore);
    this.gamerScore = parse.stringToInt(opts.gamerScore);
    this.rating = opts.rating;
    this.playedBy = opts.playedBy;
    this.completedBy = opts.completedBy;
    this.completionEstimate = opts.completionEstimate;
    this.achievements = opts.achievements;
    this.downloadableContent = opts.downloadableContent || [];
    this.information = opts.information;
  }

  getAchievements(opts = {}) {
    if (opts.includeBase && opts.includeDlc && this.downloadableContent.length > 0)
      return this.achievements.concat(this.downloadableContent.map(dlc => dlc.achievements).flat());

    if (opts.includeBase)
      return this.achievements;

    if (opts.includeDlc && this.downloadableContent.length > 0)
      return this.downloadableContent.map(dlc => dlc.achievements).flat();

    return [];
  }

  getWinners(opts = {}) {
    let winners = this.getAchievements(opts)
        .map(achievement => achievement.winners.pages.filter(page => page.length > 0))
        .flat(2);

    if (winners.length === 0) return winners;

    if (opts.onlineUnlocksOnly)
      winners = winners.filter(winner => !winner.unlockOffline);

    if (opts.sort) {
      switch (opts.sort.toLowerCase()) {
        case 'asc':
        case 'ascending': winners.sort((a, b) => new Date(b.unlockDate) < new Date(a.unlockDate) ? 1 : -1);
          break;

        case 'desc':
        case 'descending': winners.sort((a, b) => new Date(b.unlockDate) > new Date(a.unlockDate) ? 1 : -1);
          break;
      }
    }

    if (opts.uniqueWinners) {
      winners = winners.reduce((unique, o) => {
        if (!unique.some(obj => obj.link === o.link)) unique.push(o);
        return unique;
      }, []);
    }

    return winners.slice(opts.skip || 0, opts.take || winners.length);
  }

  getDetails() {
    return new Promise((resolve, reject) => memoizeFetch(this.link)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const panelHeaders = [...doc.querySelectorAll('.panel-header:not(.p)')];

          for (let i = 0; i < panelHeaders.length; i++) {
            const panelHeader = panelHeaders[i];

            const name = panelHeader.querySelector('h3 a');
            const scoreDetails = getScoreDetails(panelHeader);
            const statDetails = getStatDetails(panelHeader, i === 0);
            const achievements = i === 0 ? getBaseAchievements(doc) : getDLCAchievements(panelHeader);
            const information = getInformation(name, i === 0);

            if (i === 0) {
              this.name = name.innerText;
              this.link = name.href;
              this.taScore = parse.stringToInt(scoreDetails.taScore);
              this.gamerScore = parse.stringToInt(scoreDetails.gamerScore);
              this.rating = statDetails.rating;
              this.playedBy = statDetails.playedBy;
              this.completedBy = statDetails.completedBy;
              this.completionEstimate = statDetails.completionEstimate;
              this.achievements = achievements;
              this.information = information;
            } else {
              if (this.downloadableContent.some(dlc => dlc.name === name.innerText)) continue;

              this.downloadableContent.push(new DownloadableContent({
                name: name.innerText,
                link: name.href,
                taScore: parse.stringToInt(scoreDetails.taScore),
                gamerScore: parse.stringToInt(scoreDetails.gamerScore),
                rating: statDetails.rating,
                playedBy: statDetails.playedBy,
                completedBy: statDetails.completedBy,
                completionEstimate: statDetails.completionEstimate,
                achievements: achievements,
                information: information
              }));
            }
          }

          broadcast('gameDetails:retrieved', undefined, this);

          return resolve(this);
        }).catch(err => {
          console.log('opps');
        }));
  }
}

class DownloadableContent extends Game {
  constructor(opts) {
    opts = Object.assign({}, opts);

    super(opts);

    delete this.downloadableContent;
  }

  getDetails() {
    return new Promise((resolve, reject) => memoizeFetch(this.link)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const panelHeader = doc.querySelector('.panel-header:not(.p)');

          const name = panelHeader.querySelector('h3 a');
          const scoreDetails = getScoreDetails(panelHeader);
          const statDetails = getStatDetails(panelHeader, false);
          const achievements = getBaseAchievements(doc);
          const information = getInformation(name, false);

          this.name = name.innerText;
          this.link = name.href;
          this.taScore = parse.stringToInt(scoreDetails.taScore);
          this.gamerScore = parse.stringToInt(scoreDetails.gamerScore);
          this.rating = statDetails.rating;
          this.playedBy = statDetails.playedBy;
          this.completedBy = statDetails.completedBy;
          this.completionEstimate = statDetails.completionEstimate;
          this.achievements = achievements;
          this.information = information;

          broadcast('gameDlcDetails:retrieved', undefined, this);

          return resolve(this);
        }).catch(err => {
          console.log('opps');
        }));
  }

  getAchievements() {
    return this.achievements;
  }
}

module.exports = {
  Game,
  DownloadableContent
};
