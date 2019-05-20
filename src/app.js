const telegram = require('./telegram');
const viber = require('./viber');
const webApiServer = require('./web-api');

function start() {
  telegram.launch();
  viber.launch();
  webApiServer.listen();
}

start();
