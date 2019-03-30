const Koa = require('koa');

const log = require('../logger')(__filename);
const errorHandler = require('./utils/error-handler');
const rootRouter = require('./routes');

const { WEB_PORT } = require('../config');

const app = new Koa();

app.on('error', (err, ctx) => {
  log.error({ err }, `WEB: HREF: ${ctx.href}`);
});

app.use(errorHandler());

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

function listen() {
  return app.listen(WEB_PORT, () => {
    log.info(`Web API is listening on port ${WEB_PORT}`);
  });
}

module.exports = {
  listen,
  koaApp: app,
};
