const path = require('path');
const { get } = require('https');
const { getFileLink } = require('../../services');
const { WEB_API_V1_PREFIX } = require('../../config');

// TODO: move suffixes and response names to config
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

function getPhotoURL(ctx) {
  if (!ctx.accepts('image/*')) {
    ctx.throw(415, 'Images only!');
  }
  const imageName = path.relative(ctx.path, routePhoto);
  //TODO: handle empty string
  return getFileLink(imageName);
}

function getPhotoStream(url) {
  return new Promise((resolve, reject) => {
    get(url, res => resolve(res)).on('error', error => reject(error));
  });
}

async function sendPhoto(ctx) {
  const photoURL = getPhotoURL(ctx);
  //get photo name (id)
  //get photo stream
  //send photo stream

  try {
    const res = await getPhotoStream('https://i.ibb.co/rpn22CF/pexels-photo-1276553.jpg');
    ctx.type = res.headers['content-type'];
    ctx.body = res;
  } catch (error) {
    ctx.body = addError({}, 'Cannot get photo');
    ctx.status = 500;
    console.log(error);
  }
}

module.exports = ({ router }) => {
  const startsWithPhotoRoute = new RegExp(`^${routePhoto}/.+$`);
  router.get(startsWithPhotoRoute, async ctx => sendPhoto(ctx));
};
