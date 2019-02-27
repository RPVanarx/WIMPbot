const Koa = require('koa');
const Router = require('koa-router');
const { WEB_PORT } = require('../config');
// const services = require('../services');

const app = new Koa();

const rootRouter = new Router();
require('./routes/root')({ router: rootRouter });

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

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
