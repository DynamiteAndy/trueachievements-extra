const self = require('./self');
const promise = require('../components/promise');
const { broadcast } = require('../components/events');

const gamerDetailsCache = {};

module.exports = {
  /**
  * Gets gamer details
  * @param {games} (Array[gamer], string or gamer) A collection of gamers to get details for.
  * @return {array[gamer] || gamer} A collection of gamers with details OR a gamer.
  */
  get: (gamers) => {
    gamers = Array.isArray(gamers) ? gamers : [gamers];

    if (!gamerDetailsCache[self.get().name]) gamerDetailsCache[self.get().name] = self.get();

    return promise.allSequentially(gamers.map(gamer => () => new Promise((resolve, reject) => {
      if (gamerDetailsCache.hasOwnProperty(gamer.name)) {
        const gamerElement = gamer.element;
        gamerDetailsCache[gamer.name] = Object.assign(gamer, gamerDetailsCache[gamer.name]);
        gamer.element = gamerElement;

        broadcast('gamerDetails:retrieved', undefined, gamer);

        return resolve(gamer);
      }

      fetch(gamer.link)
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const panelHeader = doc.querySelector('.panel-header.gamer');

            gamer.name = panelHeader.querySelector('.title a').innerText;
            gamer.online = panelHeader.querySelector('.gamer .tile-indicator') !== null;
            gamerDetailsCache[gamer.name] = Object.assign(gamer, gamerDetailsCache[gamer.name]);

            broadcast('gamerDetails:retrieved', undefined, gamer);

            return resolve(gamer);
          }).catch(err => {
            console.log('Failed to fetch page: ', err);
            return reject(err);
          });
    }))).then(gamers => gamers.length === 1 ? gamers[0] : gamers);
  }
};
