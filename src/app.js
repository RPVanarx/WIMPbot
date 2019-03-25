const dbinit = require('./dbinit');

function start() {
  const telegram = require('./telegram'); // eslint-disable-line global-require
  const api = require('./testapi/api'); // eslint-disable-line global-require
  const webApiServer = require('./web-api'); // eslint-disable-line global-require

  telegram.launch();
  api.listen();
  webApiServer.listen();
}

async function init() {
  await dbinit.init();
  start();
}

init();
