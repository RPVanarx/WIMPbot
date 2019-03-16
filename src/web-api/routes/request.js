const path = require('path');
const koaBody = require('koa-body')({ multipart: true });
const validator = require('../utils/validator');

const { WEB_API_V1_PREFIX, WEB_API_PATH_REQUEST: SUFFIX } = require('../../config');

const route = path.join(WEB_API_V1_PREFIX, SUFFIX);

function validateFields(ctx) {
  const result = validator.requestQuery(ctx.request.body);
  ctx.assert(!result.length, 400, result.join(' '));
}

function validatePhoto(ctx) {
  const result = validator.photoUpload(ctx.request.files);
  ctx.assert(!result.length, 400, result.join(' '));
}

function parseRequest(ctx) {
  validateFields(ctx);
  validatePhoto(ctx);
}

// TODO: Limit max file size
// TODO: Limit image types
async function handlePost(ctx) {
  parseRequest(ctx);
  // get user key
  // upload file and get id
  // add request
  console.log('Fields: ', ctx.request.body);
  console.log('Files: ', ctx.request.files);
  ctx.body = JSON.stringify({ body: ctx.request.body, files: ctx.request.files }, null, 2);
}
/*
 request.userName = telegram user name,
 request.platformId = telegram user id,
 request.platformType = telegram,
 request.requestType = search,
 request.longitude,
 request.latitude,
 request.photo,
 request.message,
*/
module.exports = ({ router }) => {
  router.post(route, koaBody, async ctx => handlePost(ctx));
};
