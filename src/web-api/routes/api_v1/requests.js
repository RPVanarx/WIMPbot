const Router = require('koa-router');

const { getInArea } = require('../../../services/request');

const validator = require('../../utils/validator');

const {
  defaultValues: { RADIUS },
  webApi: {
    PREFIX: { API_V1, PHOTO, REQUESTS, LIST },
  },
} = require('../../../config');

const router = new Router({
  prefix: REQUESTS + LIST,
});

function validateQuery(ctx) {
  ctx.request.query.r = ctx.request.query.r || RADIUS;
  const errors = validator.listQuery(ctx.request.query);
  ctx.assert(!errors.length, 400, errors.join(' '));
}

function getPhotoUrl(photoId, { origin }) {
  const photoUrlPath = new URL(origin);
  photoUrlPath.pathname = `${API_V1}${PHOTO}/${photoId}`;
  return photoUrlPath;
}

function convertToResponse(dbRequests, ctx) {
  return dbRequests.map(request => {
    const r = { ...request };

    return {
      id: r.id.toString(),
      type: r.requestType,
      message: r.message,
      photoURL: getPhotoUrl(r.photo, ctx),
      created: r.created.getTime().toString(),
      username: r.username,
      userPlatform: r.platformType,
      lon: r.location.x.toString(),
      lat: r.location.y.toString(),
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

  return getInArea(payload) || [];
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
