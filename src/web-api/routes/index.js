const Router = require('koa-router');
const apiV1Router = require('./api_v1');

const router = new Router();

router.get('/', async ctx => {
  ctx.body = { usage: `${ctx.protocol}://${ctx.host}/api/v1/*` };
});

router.use(apiV1Router.routes());
router.use(apiV1Router.allowedMethods());

module.exports = router;
