const rootRoutes = ['/', '/api', '/api/v1'];

function setResponse(ctx) {
  const message = { message: 'Usage: /api/v1/*' };
  ctx.body = message;
}

module.exports = ({ router }) => {
  router.get(rootRoutes, async ctx => setResponse(ctx));
};
