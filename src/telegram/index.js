const session = require('telegraf/session');
const Router = require('telegraf/router');
const bot = require('./bot');
const {
  telegramEvents: {
    SCENES: { REGISTRATION_MENU, REQUEST_MENU },
    BUTTONS: { DELETE_REQUEST, MODERATE },
  },
  localesUA: { WELCOME_MESSAGE, REGISTRATION_MENU_MESSAGE, REQUEST_MENU_MESSAGE },
  platformType: { TELEGRAM },
} = require('../config');
const log = require('../logger')(__filename);

const { stage, stagesArray } = require('./scenes');
const { startRegistrationButton, registrationMenu, requestMenu } = require('./menu');
const { deleteRequest, getUserActivity, processModerationRequest } = require('../services');

const mediaAlbumCheckMiddleware = (ctx, next) => {
  if (ctx.message && ctx.message.media_group_id) {
    if (ctx.session.mediaFlag) {
      return false;
    }
    ctx.session.mediaFlag = true;
    delete ctx.message.photo;
    return next();
  }
  delete ctx.session.mediaFlag;
  return next();
};

bot.use(session());
bot.use(mediaAlbumCheckMiddleware);
bot.use(stage.middleware());

stagesArray.forEach(scene => bot.action(scene.name, ctx => ctx.scene.enter(scene.name)));

bot.start(ctx => ctx.reply(WELCOME_MESSAGE, startRegistrationButton));

bot.action(REGISTRATION_MENU, async ctx => {
  try {
    ctx.reply(
      REGISTRATION_MENU_MESSAGE,
      registrationMenu(
        await getUserActivity({
          platformId: ctx.update.callback_query.from.id,
          platformType: TELEGRAM,
        }),
      ),
    );
  } catch (error) {
    log.error({ err: error, reqId: ctx.state.reqId }, 'callbackHandler registration menu');
  }
});

bot.action(REQUEST_MENU, ctx => ctx.reply(REQUEST_MENU_MESSAGE, requestMenu));

const callbackHandler = new Router(({ callbackQuery }) => {
  if (!callbackQuery.data) {
    return false;
  }
  const value = callbackQuery.data.split(':');
  return {
    route: value[0],
    state: {
      reqId: value[1],
      status: value[2],
    },
  };
});

callbackHandler.on(DELETE_REQUEST, async ctx => {
  try {
    await deleteRequest(ctx.state.reqId);
    ctx.deleteMessage();
  } catch (error) {
    log.error({ err: error, reqId: ctx.state.reqId }, 'callbackHandler deleteRequest');
  }
});

callbackHandler.on(MODERATE, async ctx => {
  processModerationRequest({
    reqId: ctx.state.reqId,
    statusString: ctx.state.status,
    moderatorId: ctx.update.callback_query.from.id,
  });
  ctx.deleteMessage();
});

bot.on('callback_query', callbackHandler);

module.exports = {
  launch: () => bot.launch(),
};
