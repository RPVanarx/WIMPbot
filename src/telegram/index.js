const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Router = require('telegraf/router');
const {
  EVENT_REGISTRATION_MENU,
  EVENT_REQUEST_MENU,
  TELEGRAM_TOKEN,
  WELCOME_MESSAGE,
  REGISTRATION_MENU_MESSAGE,
  REQUEST_MENU_MESSAGE,
  PLATFORM_TYPE_TELEGRAM,
} = require('../config');
const { sendPhotoMessage } = require('./addFunctions');

const bot = new Telegraf(TELEGRAM_TOKEN);
const { stage, stagesArray } = require('./stages');
const { startRegistrationButton, registrationMenu, applyMenu } = require('./menu');
const {
  deleteRequest,
  userActivity,
  changeRequestActiveStatus,
  usersInRequestRadius,
} = require('../services');

bot.use(session());
bot.use(stage.middleware());

stagesArray.forEach(scene => bot.action(scene.name, ctx => ctx.scene.enter(scene.name)));

bot.start(ctx => ctx.reply(WELCOME_MESSAGE, startRegistrationButton));

bot.action(EVENT_REGISTRATION_MENU, async ctx => {
  ctx.reply(
    REGISTRATION_MENU_MESSAGE,
    registrationMenu(
      await userActivity({
        platformId: ctx.update.callback_query.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
      }),
    ),
  );
});

bot.action(EVENT_REQUEST_MENU, ctx => ctx.reply(REQUEST_MENU_MESSAGE, applyMenu));

const callbackHandler = new Router(({ callbackQuery }) => {
  if (!callbackQuery.data) {
    return false;
  }
  const value = callbackQuery.data.split(':');
  return {
    route: value[0],
    state: {
      data: value[1],
      req: value[2],
    },
  };
});

callbackHandler.on('deleteRequest', async ctx => {
  try {
    await deleteRequest(ctx.state.data);
    ctx.deleteMessage();
  } catch (error) {
    console.error(`deleteRequest ${error}`);
  }
});

callbackHandler.on('comment', async ctx => {
  try {
    const a = await ctx.telegram.sendPhoto(
      433445035,
      'http://static1.banki.ru/ugc/62/b3/09/df/7255314.jpg',
    );
    console.log(a);
  } catch (error) {
    console.error(`comment ${error}`);
  }
});

callbackHandler.on('moderate', async ctx => {
  try {
    if (!JSON.parse(ctx.state.data)) {
      console.log('send message to user that him request was decline');
      ctx.deleteMessage();
      return;
    }
    const request = await changeRequestActiveStatus({
      reqId: ctx.state.req,
      value: ctx.state.data,
      moderatorId: ctx.update.callback_query.from.id,
    });
    const users = await usersInRequestRadius(request.location);
    users.forEach(element => sendPhotoMessage({ ctx, request, chatId: element.platform_id }));
  } catch (error) {
    console.error(`moderate ${error}`);
  }
});

bot.on('callback_query', callbackHandler);

bot.startPolling();
