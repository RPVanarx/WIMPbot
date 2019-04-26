const http = require('http');
const bot = require('./bot');
const ngrokURL = require('./getNgrokPublicUrl');
const routes = require('./routes'); // TODO: use or remove
const log = require('../logger')(__filename);

const port = 3000;
const app = bot.middleware();

const startViber = async () => {
  const url = await ngrokURL.getPublicUrl();
  bot.setWebhook(url).catch(error => log.error({ err: error }, 'viber launch'));
  http.createServer(app).listen(port);
};

process
  .on('unhandledRejection', (reason, p) => {
    log.error({ err: reason }, `viber launch ${p}`);
  })
  .on('uncaughtException', err => {
    log.error({ err }, 'viber launch');
    process.exit(1);
  });

function launch() {
  startViber().catch(err => log.error({ err }, `Cannot start viber: ${err}`));
}

module.exports = {
  launch,
};
