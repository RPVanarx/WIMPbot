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
  return dbRequests.map(({ id, message, username, location: { x, y }, ...rest }) => {
    return {
      id,
      message,
      username,
      lon: x,
      lat: y,
      type: rest.requestType,
      photoURL: getPhotoUrl(rest.photo, ctx),
      created: rest.created.getTime().toString(),
      userPlatform: rest.platformType,
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
