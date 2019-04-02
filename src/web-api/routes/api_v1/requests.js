const Router = require('koa-router');

const validator = require('../../utils/validator');
const { getRequestsInArea } = require('../../../services');

const {
  DEFAULT_VALUES,
  WEB_API_V1_PREFIX,
  WEB_API_PATH_PHOTO,
  WEB_API_PATH_REQUESTS: REQUEST_SUFFIX,
  WEB_API_PATH_LIST: LIST_SUFFIX,
} = require('../../../config');

const router = new Router({
  prefix: REQUEST_SUFFIX + LIST_SUFFIX,
});

function validateQuery(ctx) {
  ctx.request.query.r = ctx.request.query.r || DEFAULT_VALUES.RADIUS;
  const errors = validator.listQuery(ctx.request.query);
  ctx.assert(!errors.length, 400, errors.join(' '));
}

function getPhotoUrl(photoId, { origin }) {
  const photoUrlPath = new URL(origin);
  photoUrlPath.pathname = WEB_API_V1_PREFIX + WEB_API_PATH_PHOTO + photoId;
  return photoUrlPath;
}

function convertToResponse(dbRequests, ctx) {
  return dbRequests.map(request => {
    const r = { ...request };

    return {
      id: r.id.toString(),
      type: r.request_type,
      message: r.message,
      photoURL: getPhotoUrl(r.photo, ctx),
      creationDate: r.creation_date.getTime().toString(),
      username: r.user_name,
      userPlatform: r.platform_type,
    };
  });
}

function getRequests({ r, d, lon, lat }) {
  const payload = {
    latitude: Number.parseFloat(lat),
    longitude: Number.parseFloat(lon),
    radius: Number.parseInt(r, 10),
    days: Number.parseInt(d, 10),
  };

  return getRequestsInArea(payload) || [];
}

async function getList(ctx) {
  validateQuery(ctx);

  try {
    const dbRequests = await getRequests(ctx.request.query);
    const resRequests = convertToResponse(dbRequests, ctx);
    ctx.body = { requests: resRequests };
  } catch (err) {
    ctx.throw(500, 'Cannot get requests', { error: err });
  }
}

router.get('/', getList);

module.exports = router;
