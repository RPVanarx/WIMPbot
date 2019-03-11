const path = require('path');
const services = require('../../services');
const { WEB_API_V1_PREFIX } = require('../../config');

const routePhoto = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);

const REQUEST_SUFFIX = '/photo';
const ERROR_NAME = 'error';

function addError(obj, errorValue = '', force = false) {
  if (!force && ERROR_NAME in obj && !obj[ERROR_NAME]) {
    return obj;
  }

  obj[ERROR_NAME] = errorValue;
  return obj;
}

function set404(ctx) {
  ctx.body = addError({}, 'Not Found');
  ctx.status = 404;
}

function sendPhoto(ctx) {
  // TODO: send photo
}

module.exports = ({ router }) => {
  router.get(routePhoto, async ctx => sendPhoto(ctx));

  const startsWithRequestRoute = new RegExp(`^${routePhoto}(/|$)`);
  router.get(startsWithRequestRoute, async ctx => set404(ctx));
};
