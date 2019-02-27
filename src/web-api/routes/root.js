module.exports = ({ router }) => {
  router.get('/', async ctx => {
    ctx.body = 'Usage: /api/v1/*';
  });
};
