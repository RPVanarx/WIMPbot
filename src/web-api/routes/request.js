const path = require('path');
const koaBody = require('koa-body')({ multipart: true });

const { WEB_API_V1_PREFIX, WEB_API_PATH_REQUEST: SUFFIX } = require('../../config');

const route = path.join(WEB_API_V1_PREFIX, SUFFIX);

async function handlePost(ctx) {
  const { files } = ctx.request;
  console.log(files);
  //   const { key, url } = await uploadFile({
  //     fileName: file.name,
  //     filePath: file.path,
  //     fileType: file.type,
  //   });
  //   ctx.body = { key, url };
}

module.exports = ({ router }) => {
  router.post(route, koaBody, async ctx => handlePost(ctx));
};
