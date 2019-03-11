const path = require('path');
const { getRequestsInArea } = require('../../services');
const { WEB_API_V1_PREFIX, DEFAULT_RADIUS } = require('../../config');

const REQUEST_SUFFIX = '/requests';
const LIST_SUFFIX = '/list';
const ERROR_NAME = 'error';

const routeRequests = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);
const routeList = path.join(routeRequests, LIST_SUFFIX);

function addError(obj, errorValue = '', force = false) {
  if (!force && ERROR_NAME in obj && !obj[ERROR_NAME]) {
    return obj;
  }

  obj[ERROR_NAME] = errorValue;
  return obj;
}

function formRequestObject(req) {
  const creationDate = req.creation_date.getTime();
  return {
    id: req.id,
    type: req.request_type,
    message: req.message,
    photoURL: req.photo,
    creationDate,
    username: req.user_name,
    userPlatform: req.platform_type,
  };
}

function formBody(requests) {
  const body = { requests: [] };
  addError(body, '');

  body.requests = requests.map(formRequestObject);
  return body;
}

async function getRequests({ r, d, lon, lat }) {
  const payload = {
    latitude: Number.parseFloat(lat),
    longitude: Number.parseFloat(lon),
    radius: Number.parseInt(r, 10),
    days: Number.parseInt(d, 10),
  };

  return getRequestsInArea(payload);
}

function validateQuery({ r = DEFAULT_RADIUS, d, lon, lat }) {
  const radius = Number.parseInt(r, 10);
  if (Number.isNaN(radius) || radius < 1) {
    throw new TypeError("Radius 'r' must be a positive number!");
  }

  const days = Number.parseInt(d, 10);
  if (Number.isNaN(days) || days < 1) {
    // TODO: check max value
    throw new TypeError("Days 'd' must be a positive number!");
  }

  const longitude = Number.parseFloat(lon);
  if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
    throw new TypeError("Longitude 'lon' must be a number in range -180 to 180!");
  }

  const latitude = Number.parseFloat(lat);
  if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    throw new TypeError("Latitude 'lat' must be a number in range -90 to 90!");
  }
}

async function setResponse(ctx) {
  try {
    validateQuery(ctx.request.query);
  } catch (err) {
    ctx.body = addError({}, `Validation failed: ${err.message}`);
    ctx.status = 400;
    return;
  }

  let requests;
  try {
    requests = await getRequests(ctx.request.query);
  } catch (err) {
    console.error('Error: cannot get requests');
    throw err;
  }

  ctx.body = formBody(requests);
}

function set404(ctx) {
  ctx.body = addError({}, 'Not Found');
  ctx.status = 404;
}

module.exports = ({ router }) => {
  router.get(routeList, async ctx => setResponse(ctx));

  const startsWithRequestRoute = new RegExp(`^${routeRequests}(/|$)`);
  router.get(startsWithRequestRoute, async ctx => set404(ctx));
};
