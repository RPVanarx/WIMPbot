const path = require('path');
const validator = require('../utils/validator');
const cookies = require('../utils/cookies');
const { registerUser } = require('../../services');
const { setError } = require('../utils/error-handling');
const { getUserCredentials, isExpired } = require('../utils/web-token');

const { WEB_API_V1_PREFIX, WEB_API_PATH_SIGNUP, PLATFORM_TYPE_TELEGRAM } = require('../../config');

const route = path.join(WEB_API_V1_PREFIX, WEB_API_PATH_SIGNUP);

function formBody({ registered }) {
  return { ...setError(), registered };
}

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

function validateToken(ctx, token) {
  let isTokenExpired = null;
  try {
    isTokenExpired = isExpired(token);
  } catch (err) {
    ctx.throw(401, 'Invalid token!', { error: err });
  }

  if (isTokenExpired) ctx.throw(401, 'Token expired! Please sign in again!');
}

function getPayload(ctx) {
  validateQuery(ctx);

  const { lat, lon } = ctx.request.query;

  const token = cookies.getToken(ctx);
  validateToken(ctx, token);

  return {
    latitude: Number.parseFloat(lat),
    longitude: Number.parseFloat(lon),
    webToken: token,
  };
}

async function handleRoute(ctx) {
  const { longitude, latitude, webToken } = getPayload(ctx);

  const { id: platformId } = getUserCredentials(webToken);

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

  ctx.body = formBody({ registered: isRegistered });
}

module.exports = ({ router }) => {
  router.get(route, async ctx => handleRoute(ctx));
};
