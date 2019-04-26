const Router = require('koa-router');

const photo = require('./photo');
const request = require('./request');
const requests = require('./requests');
const signin = require('./signin');
const signup = require('./signup');

const {
  PREFIX: { API_V1 },
} = require('../../../config/webApi');

const router = new Router({
  prefix: API_V1,
});

router.get('/', ctx => {
  ctx.body = {
    name: `WIMP API`,
    version: `1.0`,
    git: `https://github.com/RPVanarx/WIMPbot`,
  };
});

router.use(photo.routes()).use(photo.allowedMethods());
router.use(request.routes()).use(request.allowedMethods());
router.use(requests.routes()).use(requests.allowedMethods());
router.use(signin.routes()).use(signin.allowedMethods());
router.use(signup.routes()).use(signup.allowedMethods());

module.exports = router;
