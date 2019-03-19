const session = require('telegraf/session');
const Router = require('telegraf/router');
const bot = require('./bot');
const {
  EVENT_NAMES: { REGISTRATION_MENU, REQUEST_MENU },
  WELCOME_MESSAGE,
  REGISTRATION_MENU_MESSAGE,
  REQUEST_MENU_MESSAGE,
  PLATFORM_TYPE_TELEGRAM,
} = require('../config');

const { stage, stagesArray } = require('./stages');
const { startRegistrationButton, registrationMenu, requestMenu } = require('./menu');
const { deleteRequest, getUserActivity, processModerationRequest } = require('../services');

bot.use(session());
bot.use(stage.middleware());

stagesArray.forEach(scene => bot.action(scene.name, ctx => ctx.scene.enter(scene.name)));

bot.start(ctx => ctx.reply(WELCOME_MESSAGE, startRegistrationButton));

bot.action(REGISTRATION_MENU, async ctx => {
  ctx.reply(
    REGISTRATION_MENU_MESSAGE,
    registrationMenu(
      await getUserActivity({
        platformId: ctx.update.callback_query.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
      }),
    ),
  );
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

callbackHandler.on('deleteRequest', async ctx => {
  try {
    await deleteRequest(ctx.state.reqId);
    ctx.deleteMessage();
  } catch (error) {
    console.error(`deleteRequest ${error}`);
  }
});

// callbackHandler.on('comment', async ctx => {
//   try {
//     const a = await ctx.telegram.sendPhoto(
//       433445035,
//       'http://static1.banki.ru/ugc/62/b3/09/df/7255314.jpg',
//     );
//     console.log(a);
//   } catch (error) {
//     console.error(`comment ${error}`);
//   }
// });

callbackHandler.on('moderate', async ctx => {
  processModerationRequest({
    reqId: ctx.state.reqId,
    statusString: ctx.state.status,
    moderatorId: ctx.update.callback_query.from.id,
  });
  ctx.deleteMessage();
});

bot.on('callback_query', callbackHandler);

bot.startPolling();
