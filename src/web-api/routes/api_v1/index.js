const Router = require('koa-router');
const photo = require('./photo');
const signin = require('./signin');
const signup = require('./signup');

const { WEB_API_V1_PREFIX } = require('../../../config');

const router = new Router({
  prefix: WEB_API_V1_PREFIX,
});

router.get('/', ctx => {
  ctx.body = {
    name: `WIMP API`,
    version: `1.0`,
    git: `https://github.com/RPVanarx/WIMPbot`,
  };
});

router.use(photo.routes()).use(photo.allowedMethods());
router.use(signin.routes()).use(signin.allowedMethods());
router.use(signup.routes()).use(signup.allowedMethods());

// createRouter(require('./routes/requests'));
// createRouter(require('./routes/request'));

module.exports = router;
