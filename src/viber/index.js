const http = require('http');
const bot = require('./bot');
const ngrokURL = require('./get_public_url');
const routes = require('./routes');

const port = 3000;
const app = bot.middleware();

const startViber = async () => {
  const url = await ngrokURL.getPublicUrl();
  console.log(url);
  bot.setWebhook(url).catch(err => console.log(err));
  http.createServer(app).listen(port);
};

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

module.exports = { launch: () => startViber() };
