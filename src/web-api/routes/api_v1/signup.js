const Router = require('koa-router');

const token = require('../../middleware/token');
const validator = require('../../utils/validator');
const { registerUser } = require('../../../services');

const { WEB_API_PATH_SIGNUP, PLATFORM_TYPE_TELEGRAM } = require('../../../config');

const router = new Router({
  prefix: WEB_API_PATH_SIGNUP,
});

function validateQuery(ctx) {
  ctx.assert(ctx.request.query, 400, 'Query parameters not found!');

  const { lat, lon } = ctx.request.query;
  let errors = [];
  try {
    errors = validator.signupQuery({ lon, lat });
  } catch (err) {
    ctx.throw(500, 'Signup query validation failed!', { error: err });
  }
  ctx.assert(!errors.length, 400, errors.join(' '));
}

function getPayload(ctx) {
  validateQuery(ctx);
  const { lat, lon } = ctx.request.query;

  return {
    latitude: Number.parseFloat(lat),
    longitude: Number.parseFloat(lon),
  };
}

async function signup(ctx) {
  const { longitude, latitude } = getPayload(ctx);

  let isRegistered = false;
  try {
    isRegistered = await registerUser({
      platformId: ctx.token.id,
      platformType: PLATFORM_TYPE_TELEGRAM,
      longitude,
      latitude,
    });
  } catch (err) {
    ctx.throw(500, 'Cannot register user!', { error: err });
  }

  ctx.body = { registered: isRegistered };
}

router.get('/', token.get(), signup);

module.exports = router;
