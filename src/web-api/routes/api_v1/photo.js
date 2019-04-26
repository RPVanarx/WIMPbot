const Router = require('koa-router');

const { getPhotoStream } = require('../../../services/photo');

const {
  PREFIX: { PHOTO },
} = require('../../../config/webApi');

const router = new Router({
  prefix: PHOTO,
});

async function getPhoto(ctx) {
  ctx.assert(ctx.accepts('image/*'), 415, 'Client is not able to accept images!');

  const photoId = ctx.params.id;

  try {
    ctx.body = await getPhotoStream(photoId);
    ctx.type = 'image/jpeg';
  } catch (err) {
    if (err.code === 400 || err.code === 404) ctx.throw(404, 'Photo not found', { error: err });

    ctx.throw(500, 'Cannot get photo', { error: err });
  }
}

router.get('/:id', getPhoto);

module.exports = router;
