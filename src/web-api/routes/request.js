const path = require('path');
const koaBody = require('koa-body')({ multipart: true });

const { WEB_API_V1_PREFIX, WEB_API_PATH_REQUEST: SUFFIX } = require('../../config');

const route = path.join(WEB_API_V1_PREFIX, SUFFIX);
// TODO: Limit max file size
// TODO: Limit image types
async function handlePost(ctx) {
  console.log('Fields: ', ctx.request.body);
  console.log('Files: ', ctx.request.files);
  ctx.body = JSON.stringify({ body: ctx.request.body, files: ctx.request.files }, null, 2);
}
/*
 request.userName,
 request.platformId,
 request.platformType,
 request.requestType,
 request.longitude,
 request.latitude,
 request.photo,
 request.message,
*/
module.exports = ({ router }) => {
  router.post(route, koaBody, async ctx => handlePost(ctx));
};
