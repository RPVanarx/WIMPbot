const path = require('path');
const { get } = require('https');
const { getFileLink } = require('../../services');
const { WEB_API_V1_PREFIX } = require('../../config');

// TODO: move suffixes and response names to config
// TODO: move photo to requests
const REQUEST_SUFFIX = '/photo';
const ERROR_NAME = 'error';

const routePhoto = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);

// TODO: move addError and set404 to separate module or move 404 to index.js
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

function getPhotoId(ctx) {
  if (!ctx.accepts('image/*')) {
    ctx.throw(415, 'Images only!');
  }
  const photoId = path.relative(routePhoto, ctx.path);
  // TODO: handle empty string
  // TODO: validate ID
  return photoId;
}

async function getPhotoURL(id) {
  try {
    return getFileLink(id);
  } catch (err) {
    throw new Error('Cannot get photo link');
  }
}

function getPhoto(url) {
  return new Promise((resolve, reject) => {
    get(url, res => resolve(res)).on('error', error => reject(error));
  });
}

async function handlePhotoRoute(ctx) {
  const photoId = getPhotoId(ctx);

  try {
    const photoURL = await getPhotoURL(photoId);
    const response = await getPhoto(photoURL);
    ctx.type = response.headers['content-type'];
    ctx.body = response;
  } catch (err) {
    ctx.body = addError({}, `Cannot get photo: ${err.message}`);
    ctx.status = 500;
  }
}

module.exports = ({ router }) => {
  const startsWithPhotoRoute = new RegExp(`^${routePhoto}/.+$`);
  router.get(startsWithPhotoRoute, async ctx => handlePhotoRoute(ctx));
};
