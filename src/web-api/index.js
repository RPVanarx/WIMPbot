const Koa = require('koa');
const Router = require('koa-router');
const { WEB_PORT } = require('../config');
const { set404, handleError } = require('./utils/error-handling');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();

    if (ctx.status === 404) set404(ctx);
  } catch (err) {
    if (handleError(err, ctx)) return;

    ctx.status = err.status || 500;
    ctx.body = !err.error ? 'Internal server error' : err.message;

    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', (err, ctx) => {
  console.error('------ !!! ERRORR !!! ------');
  console.error(err);
  console.log(`Path: ${ctx.path}`);
});

function createRouter(route, KoaRouter = Router, koaApp = app) {
  const router = new KoaRouter();
  route({ router });

  koaApp.use(router.routes());
  koaApp.use(router.allowedMethods());

  return router;
}
createRouter(require('./routes/root'));
createRouter(require('./routes/photo'));
createRouter(require('./routes/requests'));
createRouter(require('./routes/request'));
createRouter(require('./routes/signin'));

const server = app.listen(WEB_PORT, () => {
  console.log(`Web API is listening on port ${WEB_PORT}`);
});

module.exports = server;
