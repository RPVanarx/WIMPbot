const path = require('path');
const { getRequestsInArea } = require('../../services');
const {
  WEB_API_V1_PREFIX,
  DEFAULT_RADIUS,
  WEB_API_PATH_REQUESTS: REQUEST_SUFFIX,
  WEB_API_PATH_LIST: LIST_SUFFIX,
} = require('../../config');
const { setError } = require('../utils/error-handling');

const routeRequests = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);
const routeList = path.join(routeRequests, LIST_SUFFIX);

function validateQuery(ctx) {
  const inRange = (number, min, max) => number >= min && number <= max;

  const { r = DEFAULT_RADIUS, d, lon, lat } = ctx.request.query;

  const radius = Number.parseInt(r, 10);
  ctx.assert(!Number.isNaN(radius) && radius >= 1, 400, "Radius 'r' must be a positive number!");

  const days = Number.parseInt(d, 10);
  // TODO: check max value
  ctx.assert(!Number.isNaN(days) && days >= 1, 400, "Days 'd' must be a positive number!");

  const longitude = Number.parseFloat(lon);
  ctx.assert(
    !Number.isNaN(longitude) && inRange(longitude, -180, 180),
    400,
    "Longitude 'lon' must be a number in range -180 to 180!",
  );

  const latitude = Number.parseFloat(lat);
  ctx.assert(
    !Number.isNaN(latitude) && inRange(latitude, -90, 90),
    400,
    "Latitude 'lat' must be a number in range -90 to 90!",
  );
}

function formRequestObject(request) {
  const r = { ...request };
  return {
    id: r.id.toString(),
    type: r.request_type,
    message: r.message,
    photoURL: r.photo,
    creationDate: r.creation_date.getTime().toString(),
    username: r.user_name,
    userPlatform: r.platform_type,
  };
}

function formBody(requests) {
  const body = setError();
  body.requests = requests.map(formRequestObject);
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
    const requests = await getRequests(ctx.request.query);
    ctx.body = formBody(requests);
  } catch (err) {
    ctx.throw(500, 'Cannot get requests', { error: err });
  }
}

module.exports = ({ router }) => {
  router.get(routeList, async ctx => setResponse(ctx));

  // const startsWithRequestRoute = new RegExp(`^${routeRequests}(/|$)`);
  // router.get(startsWithRequestRoute, async ctx => set404(ctx));
};
