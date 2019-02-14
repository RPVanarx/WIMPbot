// const config = require('../config');
// const { user, requests } = require('../db');
// const services = require('../services');
const Koa = require('koa');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Web API init';
});

app.listen(3000);
