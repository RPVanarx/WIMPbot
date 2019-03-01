const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const getFileLink = require('../telegram');

const app = new Koa();
const router = new Router();

router.get('/img/:id', async ctx => {
  let url;
  try {
    url = await getFileLink(ctx.params.id);
    const { data } = await axios({ method: 'get', responseType: 'stream', url });
    ctx.status = 200;
    ctx.type = 'image/jpeg';
    ctx.body = data;
  } catch (err) {
    ctx.status = 404;
    console.log(err);
  }
});

app.use(router.middleware());

app.listen(3000);
