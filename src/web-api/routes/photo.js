const path = require('path');
const photo = require('../../utils/photo');
const { urlToId } = require('../utils/photo');
const { WEB_API_V1_PREFIX, WEB_API_PATH_PHOTO: SUFFIX } = require('../../config');

const routePhoto = path.join(WEB_API_V1_PREFIX, SUFFIX);

async function handlePhotoRoute(ctx) {
  ctx.assert(ctx.accepts('image/*'), 415, 'Client is not able to accept images!');

  const photoId = urlToId(ctx.href);

  try {
    ctx.body = await photo.getPhotoStream(photoId);
    ctx.type = 'image/jpeg';
  } catch (err) {
    if (err.code === 404) ctx.throw(404, 'Photo not found', { error: err });

    ctx.throw(500, 'Cannot get photo', { error: err });
  }
}

module.exports = ({ router }) => {
  const startsWithPhotoRoute = new RegExp(`^${routePhoto}/.+$`);
  router.get(startsWithPhotoRoute, async ctx => handlePhotoRoute(ctx));
};
