const path = require('path');
const validator = require('../utils/validator');
const { getRequestsInArea } = require('../../services');
const { setError } = require('../utils/error-handling');
const { idToUrl } = require('../utils/photo-url');

const {
  WEB_API_V1_PREFIX,
  DEFAULT_VALUES,
  WEB_API_PATH_REQUESTS: REQUEST_SUFFIX,
  WEB_API_PATH_LIST: LIST_SUFFIX,
} = require('../../config');

const routeRequests = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);
const routeList = path.join(routeRequests, LIST_SUFFIX);

function validateQuery(ctx) {
  ctx.assert(ctx.request.query, 400, 'Query parameters not found!');

  const { r = DEFAULT_VALUES.RADIUS, d, lon, lat } = ctx.request.query;

  let errors = [];
  try {
    errors = validator.listQuery({ r, d, lon, lat });
  } catch (err) {
    ctx.throw(500, 'List query validation failed!', { error: err });
  }

  ctx.assert(!errors.length, 400, errors.join(' '));
}

function getPhotoUrl(photoId, ctx) {
  const photoUrlPath = new URL(ctx.origin);
  photoUrlPath.pathname = path.join(WEB_API_V1_PREFIX, '/photo');

  let photoURL = '';
  try {
    photoURL = idToUrl(photoId, photoUrlPath.href);
  } catch (err) {
    ctx.app.emit('error', err, ctx);
  }

  return photoURL;
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

function formBody(requests) {
  const body = setError();
  body.requests = requests;
  return body;
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

async function setResponse(ctx) {
  validateQuery(ctx);

  try {
    const dbRequests = await getRequests(ctx.request.query);
    const resRequests = convertToResponse(dbRequests, ctx);
    ctx.body = formBody(resRequests);
  } catch (err) {
    ctx.throw(500, 'Cannot get requests', { error: err });
  }
}

module.exports = ({ router }) => {
  router.get(routeList, async ctx => setResponse(ctx));
};
