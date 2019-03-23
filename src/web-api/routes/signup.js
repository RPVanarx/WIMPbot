const path = require('path');
const validator = require('../utils/validator');
const { registerUser } = require('../../services');
const { WEB_API_V1_PREFIX, WEB_API_PATH_SIGNUP, PLATFORM_TYPE_TELEGRAM } = require('../../config');
const { setError } = require('../utils/error-handling');
const { getUserCredentials } = require('../utils/web-token');

const route = path.join(WEB_API_V1_PREFIX, WEB_API_PATH_SIGNUP);

function formBody({ registered, token }) {
  return { ...setError(), registered, token };
}

function validateQuery(ctx) {
  ctx.assert(ctx.request.query, 400, 'Query parameters not found!');

  const { token, lat, lon } = ctx.request.query;
  let errors = [];
  try {
    errors = validator.signupQuery({ lon, lat, token });
  } catch (err) {
    ctx.throw(500, 'POST field validation failed!', { error: err });
  }
  ctx.assert(!errors.length, 400, errors.join(' '));
}

function getPayload(ctx) {
  validateQuery(ctx);

  const { token, lat, lon } = ctx.request.query;
  return {
    latitude: Number.parseFloat(lat),
    longitude: Number.parseFloat(lon),
    webToken: token,
  };
}

async function handleRoute(ctx) {
  const { longitude, latitude, webToken } = getPayload(ctx);

  const { userId: platformId } = getUserCredentials({ webToken });

  let isRegistered = false;

  try {
    isRegistered = await registerUser({
      platformId,
      platformType: PLATFORM_TYPE_TELEGRAM,
      longitude,
      latitude,
    });
  } catch (err) {
    ctx.throw(500, 'Cannot register user!', { error: err });
  }

  ctx.body = formBody({ registered: isRegistered, token: webToken });
}

module.exports = ({ router }) => {
  router.get(route, async ctx => handleRoute(ctx));
};
