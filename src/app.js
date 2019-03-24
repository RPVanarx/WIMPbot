const dbinit = require('./dbinit');
const telegram = require('./telegram');
const api = require('./testapi/api');
const webApiServer = require('./web-api');

function start() {
  telegram.launch();
  api.listen();
  webApiServer.listen();
}

async function init() {
  await dbinit.init();
  start();
}

init();
