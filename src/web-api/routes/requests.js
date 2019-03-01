const path = require('path');
const services = require('../../services');
const { WEB_API_V1_PREFIX } = require('../../config');

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

// function getRequests(radius, daysOld, latitude, longitude) {

// }
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

async function getRequests(ctx) {
  const fakePayload = {
    latitude: 32.0833,
    longitude: 49.4323,
    radius: 1000,
    days: 30,
  };

  return services.getRequestsInArea(fakePayload);
}

async function setResponse(ctx) {
  // validateQuery(ctx);
  const requests = await getRequests(ctx);
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
