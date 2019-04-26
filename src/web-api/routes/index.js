const Router = require('koa-router');

const apiV1Router = require('./api_v1');

const {
  PREFIX: { API_V1 },
} = require('../../config/webApi');

const router = new Router();

router.get('/', async ctx => {
  ctx.body = { usage: `${ctx.protocol}://${ctx.host}${API_V1}/*` };
});

router.use(apiV1Router.routes());
router.use(apiV1Router.allowedMethods());

module.exports = router;
