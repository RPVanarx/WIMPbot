module.exports = ({ router }) => {
  router.get('/', async ctx => {
    ctx.body = 'Using: /api/v1/*';
  });
};
