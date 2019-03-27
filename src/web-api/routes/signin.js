const path = require('path');
const authorize = require('../utils/telegram-authorization');
const cookies = require('../utils/cookies');
const { getUserId } = require('../../services');
const { setError } = require('../utils/error-handling');
const { create: createToken } = require('../utils/web-token');

const { WEB_API_V1_PREFIX, WEB_API_PATH_SIGNIN, PLATFORM_TYPE_TELEGRAM } = require('../../config');

const route = path.join(WEB_API_V1_PREFIX, WEB_API_PATH_SIGNIN);

function formBody({ registered }) {
  return { ...setError(), registered };
}

async function handleRoute(ctx) {
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
  ctx.body = formBody({ registered: !!wimpUserId });
}

module.exports = ({ router }) => {
  router.get(route, async ctx => handleRoute(ctx));
};
