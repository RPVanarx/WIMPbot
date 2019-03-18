const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const multer = require('koa-multer');
const { getFileLink, getRequestsInArea } = require('../services');
const requestValidator = require('./validation');
const bot = require('../telegram/bot');

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
    };
  }
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async ctx => {
  const { file } = ctx.req;
  const res = await bot.telegram.sendPhoto(433445035, { source: file.buffer });
  ctx.body = res[res.length - 1];
});

router.get('/img/:id', async ctx => {
  const url = await getFileLink(ctx.params.id);
  const { data } = await axios({ method: 'get', responseType: 'stream', url });
  ctx.type = 'image/jpeg';
  ctx.body = data;
});

router.get('/requests/:latitude/:longitude/:radius/:days', async ctx => {
  const request = {
    latitude: parseFloat(ctx.params.latitude),
    longitude: parseFloat(ctx.params.longitude),
    radius: parseInt(ctx.params.radius, 10),
    days: parseInt(ctx.params.days, 10),
  };
  if (!requestValidator.test(request)) {
    ctx.status = 400;
    ctx.body = requestValidator.getErrors(request);
    return;
  }
  ctx.body = await getRequestsInArea(request);
});

app.use(router.middleware());

app.listen(3006);
