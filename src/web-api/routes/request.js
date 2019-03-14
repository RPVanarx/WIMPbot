const path = require('path');

const { WEB_API_V1_PREFIX, WEB_API_PATH_REQUEST: SUFFIX } = require('../../config');

const route = path.join(WEB_API_V1_PREFIX, SUFFIX);

async function handlePost(ctx) {
  console.log(ctx.request);
//   const file = ctx.request.files.file;
//   const { key, url } = await uploadFile({
//     fileName: file.name,
//     filePath: file.path,
//     fileType: file.type,
//   });
//   ctx.body = { key, url };
}

module.exports = ({ router }) => {
  router.post(route, async ctx => handlePost(ctx));
};
