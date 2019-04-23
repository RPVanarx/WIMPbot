const Router = require('koa-router');

const authorize = require('../../utils/telegram-authorization');
const token = require('../../middleware/token');
const { getUserId } = require('../../../services');

const {
  webApi: { WEB_API_PATH_SIGNIN },
  platformType: { PLATFORM_TYPE_TELEGRAM },
} = require('../../../config');

const router = new Router({
  prefix: WEB_API_PATH_SIGNIN,
});

async function signin(ctx, next) {
  const payload = { ...ctx.request.query };
  try {
    authorize(payload);
  } catch (err) {
    ctx.throw(401, `Authentication failed: ${err.message}`);
  }

  let wimpUserId = null;
  try {
    wimpUserId = await getUserId({
      platformId: payload.id,
      platformType: PLATFORM_TYPE_TELEGRAM,
    });
  } catch (err) {
    ctx.throw(500, 'Cannot get user ID!', { error: err });
  }

  ctx.chest = { id: payload.id, name: payload.username };

  await next();

  ctx.body = { registered: !!wimpUserId };
}

router.get('/', signin, token.set());

module.exports = router;
