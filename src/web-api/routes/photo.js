const path = require('path');
const { get } = require('https');
const { getFileLink } = require('../../services');
const { WEB_API_V1_PREFIX } = require('../../config');
const { urlToId, idToUrl } = require('../utils/photo');

// TODO: move suffixes and response names to config
// TODO: move photo to requests
const REQUEST_SUFFIX = '/photo';

const routePhoto = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);

function getPhotoId(ctx) {
  ctx.assert(ctx.accepts('image/*'), 415, 'Client is not able to accept images!');

  const photoId = path.relative(routePhoto, ctx.path);
  // TODO: handle empty string
  // TODO: validate ID
  // FIXME: No corresponding function in services!
  ctx.assert(!Number.isNaN(Number.parseInt(photoId, 10)), 404, 'Requested photo not found', {
    error: new Error('Photo ID not found!'),
  });

  return photoId;
}

function getPhoto(url) {
  return new Promise((resolve, reject) => {
    get(url, res => resolve(res)).on('error', error => reject(error));
  });
}

async function handlePhotoRoute(ctx) {
  const photoId = getPhotoId(ctx);

  try {
    const photoURL = await getFileLink(photoId);
    const response = await getPhoto(photoURL);

    ctx.type = response.headers['content-type'];
    ctx.body = response;
  } catch (err) {
    ctx.throw(500, 'Cannot get photo', { error: err });
  }
}

module.exports = ({ router }) => {
  const startsWithPhotoRoute = new RegExp(`^${routePhoto}/.+$`);
  router.get(startsWithPhotoRoute, async ctx => handlePhotoRoute(ctx));
};
