const path = require('path');
const { WEB_API_V1_PREFIX, WEB_API_PATH_REQUEST: SUFFIX } = require('../../config');

const route = path.join(WEB_API_V1_PREFIX, SUFFIX);

async function handlePost(ctx) {
  console.log(ctx.request);
}

module.exports = ({ router }) => {
  router.get(route, async ctx => handlePost(ctx));
};
