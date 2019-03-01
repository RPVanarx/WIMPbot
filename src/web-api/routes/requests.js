const path = require('path');
const services = require('../../services');
const { WEB_API_V1_PREFIX, RADIUS: DEFAULT_RADIUS } = require('../../config');

const REQUEST_SUFFIX = '/requests';
const LIST_SUFFIX = '/list';
const ERROR_NAME = 'error';

const requestsRoute = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);
const listRoute = path.join(requestsRoute, LIST_SUFFIX);

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

  return services.getRequestsInArea(payload);
}

function validateQuery({ r = DEFAULT_RADIUS, d, lon, lat }) {
  if (Number.isNaN(Number.parseInt(r, 10)) || r < 1) {
    throw new TypeError("Radius 'r' must be a positive number!");
  }
  if (Number.isNaN(Number.parseInt(d, 10)) || d < 1) {
    // TODO: check max value
    throw new TypeError("Days 'd' must be a positive number!");
  }
  if (Number.isNaN(Number.parseFloat(lon)) || lon < -180 || lon > 180) {
    throw new TypeError("Longitude 'lon' must be a number in range -180 to 180!");
  }
  if (Number.isNaN(Number.parseFloat(lat)) || lat < -90 || lat > 90) {
    throw new TypeError("Latitude 'lat' must be a number in range -90 to 90!");
  }
}

async function setResponse(ctx) {
  try {
    validateQuery(ctx.request.query);
  } catch (err) {
    ctx.body = addError({}, `Validation failed: ${err.message}`);
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
  router.get(listRoute, async ctx => setResponse(ctx));

  const startsWithRequestRoute = new RegExp(`^${requestsRoute}(/|$)`);
  router.get(startsWithRequestRoute, async ctx => set404(ctx));
};
