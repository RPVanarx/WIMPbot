const { WEB_API_V1_PREFIX } = require('../../config');

// '/path/to' --> [ '/', '/path/', '/path/to/' ]
const routes = WEB_API_V1_PREFIX.split('/').reduce((arr, val, idx) => {
  arr[idx] = `${arr[idx - 1] || ''}${val}/`;
  return arr;
}, []);

function setResponse(ctx) {
  ctx.body = { Usage: `${ctx.protocol}://${ctx.host}/api/v1/*` };
}

module.exports = ({ router }) => {
  router.get(routes, async ctx => setResponse(ctx));
};
