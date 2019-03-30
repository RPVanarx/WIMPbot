const Router = require('koa-router');

const authorize = require('../../utils/telegram-authorization');
const cookies = require('../../utils/cookies');
const { getUserId } = require('../../../services');
const { create: createToken } = require('../../utils/web-token');

const { WEB_API_PATH_SIGNIN, PLATFORM_TYPE_TELEGRAM } = require('../../../config');

const router = new Router({
  prefix: WEB_API_PATH_SIGNIN,
});

async function signin(ctx) {
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

  let token = null;
  try {
    token = createToken(payload.id);
  } catch (err) {
    ctx.throw(500, 'Cannot create token!', { error: err });
  }

  cookies.setToken(ctx, token, true);

  ctx.body = { registered: !!wimpUserId };
}

router.get('/', signin);

module.exports = router;
