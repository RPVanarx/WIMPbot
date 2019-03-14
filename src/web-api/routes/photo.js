const path = require('path');
const { get } = require('https');
const { getFileLink } = require('../../services');
const { WEB_API_V1_PREFIX } = require('../../config');
const { urlToId } = require('../utils/photo');

// TODO: move suffixes and response names to config
const REQUEST_SUFFIX = '/photo';

const routePhoto = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);

function getPhoto(url) {
  return new Promise((resolve, reject) => {
    get(url, res => resolve(res)).on('error', error => reject(error));
  });
}

async function handlePhotoRoute(ctx) {
  ctx.assert(ctx.accepts('image/*'), 415, 'Client is not able to accept images!');

  const photoId = urlToId(ctx.href);

  try {
    const photoURL = await getFileLink(photoId);
    const response = await getPhoto(photoURL);

    ctx.type = response.headers['content-type'];
    ctx.body = response;
  } catch (err) {
    if (err.code === 404) ctx.throw(404, 'Photo not found', { error: err });

    ctx.throw(500, 'Cannot get photo', { error: err });
  }
}

module.exports = ({ router }) => {
  const startsWithPhotoRoute = new RegExp(`^${routePhoto}/.+$`);
  router.get(startsWithPhotoRoute, async ctx => handlePhotoRoute(ctx));
};
