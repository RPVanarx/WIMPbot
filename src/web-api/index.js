const Koa = require('koa');
const Router = require('koa-router');
const { WEB_PORT } = require('../config');

const app = new Koa();

function createRouter(route, KoaRouter = Router, koaApp = app) {
  const router = new KoaRouter();
  route({ router });

  koaApp.use(router.routes());
  koaApp.use(router.allowedMethods());

  return router;
}

createRouter(require('./routes/root'));
createRouter(require('./routes/requests'));
createRouter(require('./routes/photo'));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

const server = app.listen(WEB_PORT, () => {
  console.log(`Web API is listening on port ${WEB_PORT}`);
});

module.exports = server;
