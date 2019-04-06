const Router = require('koa-router');

const photo = require('../../../utils/photo');

const { WEB_API_PATH_PHOTO } = require('../../../config');

const router = new Router({
  prefix: WEB_API_PATH_PHOTO,
});

async function getPhoto(ctx) {
  ctx.assert(ctx.accepts('image/*'), 415, 'Client is not able to accept images!');

  const photoId = ctx.params.id;

  try {
    ctx.body = await photo.getPhotoStream(photoId);
    ctx.type = 'image/jpeg';
  } catch (err) {
    if (err.code === 404) ctx.throw(404, 'Photo not found', { error: err });

    ctx.throw(500, 'Cannot get photo', { error: err });
  }
}

router.get('/:id', getPhoto);

module.exports = router;
