const Koa = require('koa');
const cors = require('@koa/cors');

const log = require('../logger')(__filename);
const errorHandler = require('./middleware/error-handler');
const rootRouter = require('./routes');

const {
  webApi: { PORT, CORS },
} = require('../config');

const app = new Koa();

app.on('error', (err, ctx) => {
  log.error({ err }, `WEB: HREF: ${ctx.href}`);
});

const corsOptions = {
  origin: CORS.ORIGIN,
  allowMethods: CORS.ALLOW_METHODS,
  maxAge: CORS.MAX_AGE,
  exposeHeaders: [ 'x-token', 'x-token-expire' ],
  keepHeadersOnError: true,
};

app.use(errorHandler());

app.use(cors(corsOptions));

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

function listen() {
  return app.listen(PORT, () => {
    log.info(`Web API is listening on port ${PORT}`);
  });
}

module.exports = {
  listen,
  koaApp: app,
};
