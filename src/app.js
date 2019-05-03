// require('./test');
// const dbinit = require('./dbinit');

const telegram = require('./telegram');
const webApiServer = require('./web-api');
const viber = require('./viber');

function start() {
  telegram.launch();
  viber.launch();
  webApiServer.listen();
}

start();
