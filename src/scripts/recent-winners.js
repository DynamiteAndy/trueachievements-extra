const fs = require('fs');
const promise = require('./components/promise');
const template = require('./helpers/template');
const parse = require('./helpers/parse');
const regex = require('../regex');
const config = require('../config');

const { Game, DownloadableContent } = require('./models/game');
const { subscribe, unsubscribe } = require('./components/events');

// Elements -------
let extensionBody;
let extensionLoadProgress;

const applyBody = () => {
  const html = fs.readFileSync('./src/views/recent-winners.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  document.querySelector('.main aside').appendChild(parsedDocument.querySelector('.js-recent-winners'));
  extensionBody = document.querySelector('.main aside .js-recent-winners');
  extensionLoadProgress = extensionBody.querySelector('.js-recent-winners-load-progress');
};

const applyTemplates = () => {
  const html = fs.readFileSync('./src/views/templates/recent-winner-row.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  [...parsedDocument.querySelectorAll('template')].forEach(template => extensionBody.insertBefore(template, extensionBody.firstChild));
};

const listen = () => {
  const gameDetailsSubscription = (regex.achievementsPage(window.location.href) || regex.allDlcAchievementsPage(window.location.href))
    ? 'gameDetails:retrieved'
    : 'gameDlcDetails:retrieved';

  subscribe(gameDetailsSubscription, (data) => {
    extensionLoadProgress.dataset.achievementCount = config.recentWinners.baseGameOnly
      ? data.achievements.length
      : regex.allDlcAchievementsPage(window.location.href) && data.downloadableContent
        ? data.downloadableContent.map(dlc => dlc.achievements).flat().length
        : data.downloadableContent
          ? data.achievements.length + data.downloadableContent.map(dlc => dlc.achievements).flat().length
          : data.achievements.length;

    extensionLoadProgress.innerText = `${extensionLoadProgress.dataset.loadProgress}/${extensionLoadProgress.dataset.achievementCount} (${Math.round((parse.stringToInt(extensionLoadProgress.dataset.loadProgress) / parse.stringToInt(extensionLoadProgress.dataset.achievementCount)) * 100)}%)`;
    extensionBody.classList.remove('hide');
    unsubscribe(gameDetailsSubscription);
  });

  subscribe('achievementWinnersByPage:retrieved', () => {
    extensionLoadProgress.dataset.loadProgress++;
    extensionLoadProgress.innerText = `${extensionLoadProgress.dataset.loadProgress}/${extensionLoadProgress.dataset.achievementCount} (${Math.round((parse.stringToInt(extensionLoadProgress.dataset.loadProgress) / parse.stringToInt(extensionLoadProgress.dataset.achievementCount)) * 100)}%)`;

    if (parse.stringToInt(extensionLoadProgress.dataset.loadProgress) >= parse.stringToInt(extensionLoadProgress.dataset.achievementCount)) unsubscribe('achievementWinnersByPage:retrieved');
  });
};

const load = async() => {
  const game = regex.achievementsPage(window.location.href)
    ? new Game({ link: window.location.href })
    : regex.allDlcAchievementsPage(window.location.href)
      ? new Game({ link: window.location.href.replace(new RegExp('/dlc$'), '/achievements') })
      : new DownloadableContent({ link: window.location.href });
  await game.getDetails();

  await promise.allConcurrently(3, game.getAchievements({
    includeDlc: !config.recentWinners.baseGameOnly,
    includeBase: !regex.gamerAllDlcAchievementsPage(window.location.href)
  }).map(achievement => () => achievement.getWinnersByPage('last')));

  const recentWinners = await promise.allConcurrently(3, game.getWinners({
    includeDlc: !config.recentWinners.baseGameOnly,
    includeBase: !regex.gamerAllDlcAchievementsPage(window.location.href),
    onlineUnlocksOnly: config.recentWinners.onlineUnlocksOnly,
    sort: 'descending',
    take: 10,
    uniqueWinners: true
  }).map(winner => () => config.onlineStatus.recentWinners ? winner.getDetails({ context: 'recentWinners' }) : Promise.resolve(winner)));

  const recentWinnersArticle = extensionBody.querySelector('article');
  const recentWinnersList = document.createElement('ol');
  recentWinnersList.classList.add('gamers');

  const gamerOnlineUnlockedOnlineTemplate = extensionBody.querySelector('#online-online-recent-winner-row');
  const gamerOnlineUnlockedOfflineTemplate = extensionBody.querySelector('#online-offline-recent-winner-row');
  const gamerOfflineUnlockedOnlineTemplate = extensionBody.querySelector('#offline-online-recent-winner-row');
  const gamerOfflineUnlockedOfflineTemplate = extensionBody.querySelector('#offline-offline-recent-winner-row');

  if (recentWinners.length === 0) {
    const noWinnersTemplate = extensionBody.querySelector('#no-winners-recent-winner-row');
    recentWinnersList.appendChild(noWinnersTemplate.content.firstElementChild.cloneNode(true));
  } else {
    recentWinners.forEach(recentWinner => {
      let recentWinnerItem = recentWinner.online
        ? recentWinner.unlockOffline
          ? gamerOnlineUnlockedOfflineTemplate.content.firstElementChild.cloneNode(true)
          : gamerOnlineUnlockedOnlineTemplate.content.firstElementChild.cloneNode(true)
        : recentWinner.unlockOffline
          ? gamerOfflineUnlockedOfflineTemplate.content.firstElementChild.cloneNode(true)
          : gamerOfflineUnlockedOnlineTemplate.content.firstElementChild.cloneNode(true);

      recentWinnerItem = template(recentWinnerItem, recentWinner);
      recentWinnersList.appendChild(recentWinnerItem);
    });
  }

  recentWinnersArticle.innerHTML = '';
  recentWinnersArticle.appendChild(recentWinnersList);
};

module.exports = () => {
  if (!config.recentWinners.enabled) return;

  const baseGamePage = regex.achievementsPage(window.location.href);
  const dlcPage = (regex.allDlcAchievementsPage(window.location.href) || regex.dlcAchievementsPage(window.location.href)) && !config.recentWinners.baseGameOnly;

  if (!baseGamePage && !dlcPage) return;

  applyBody();
  applyTemplates();
  listen();
  load();
};
