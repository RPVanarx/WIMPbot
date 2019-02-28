const path = require('path');
const { WEB_API_V1_PREFIX } = require('../../config');

const REQUEST_SUFFIX = '/requests';
const LIST_SUFFIX = '/list';

const requestsRoute = path.join(WEB_API_V1_PREFIX, REQUEST_SUFFIX);
const listRoute = path.join(requestsRoute, LIST_SUFFIX);

function setResponse(ctx) {
  const message = { error: '', message: '' };
  ctx.body = message;
}

function set404(ctx) {
  ctx.body = { error: 'Not Found' };
  ctx.status = 404;
}

module.exports = ({ router }) => {
  router.get(listRoute, async ctx => setResponse(ctx));

  const startsWithRequestRoute = new RegExp(`^${requestsRoute}(/|$)`);
  router.get(startsWithRequestRoute, async ctx => set404(ctx));
};
