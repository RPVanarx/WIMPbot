const Router = require('koa-router');

const { create } = require('../../../services/user');

const token = require('../../middleware/token');
const validator = require('../../utils/validator');

const {
  webApi: {
    PREFIX: { SIGNUP },
  },
  platformType: { TELEGRAM },
} = require('../../../config');

const router = new Router({
  prefix: SIGNUP,
});

function validateQuery(ctx) {
  const errors = validator.signupQuery(ctx.request.query);
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

  let userId = false;
  try {
    userId = await create({
      platformId: ctx.chest.id,
      platformType: TELEGRAM,
      longitude,
      latitude,
      username: ctx.chest.name,
    });
  } catch (err) {
    ctx.throw(500, 'Cannot register user!', { error: err });
  }

  ctx.body = { registered: !!userId };
}

router.get('/', token.get(), signup);

module.exports = router;
