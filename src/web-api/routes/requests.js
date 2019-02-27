const { WEB_API_V1_PREFIX } = require('../../config');

const route = `${WEB_API_V1_PREFIX}/requests`;

function setResponse(ctx) {
  const message = { message: '' };
  ctx.body = message;
}

module.exports = ({ router }) => {
  router.get(route, async ctx => {
    setResponse(ctx);
  });
};
