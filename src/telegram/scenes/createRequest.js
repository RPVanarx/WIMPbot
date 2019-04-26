const WizardScene = require('telegraf/scenes/wizard');
const {
  localesUA: { CREATE_REQUEST_MESSAGES },
  telegramEvents: {
    SCENES: { CREATE_REQUEST: name },
    BUTTONS: { SEARCH, FOUND },
  },
  platformType: { TELEGRAM },
  defaultValues: { REQUEST_MESSAGE_MAX },
} = require('../../config');
const { mainMenu, searchFoundMenu } = require('../menu');
const {
  request: { createRequest },
  user: { canUserCreateRequest },
} = require('../../services');
const log = require('../../logger')(__filename);

const scene = new WizardScene(
  name,
  async ctx => {
    delete ctx.session.userMessage;
    if (!ctx.update.callback_query.from.username) {
      ctx.reply(CREATE_REQUEST_MESSAGES.NO_USER_NAME, mainMenu);
      return ctx.scene.leave();
    }
    try {
      const status = await canUserCreateRequest({
        platformId: ctx.update.callback_query.from.id,
        platformType: TELEGRAM,
      });
      if (status) {
        ctx.reply(CREATE_REQUEST_MESSAGES.CHOICE_TYPE, searchFoundMenu);
        ctx.session.userMessage = {};
        return ctx.wizard.next();
      }
      ctx.reply(CREATE_REQUEST_MESSAGES.MANY_BAD_REQUESTS, mainMenu);
      return ctx.scene.leave();
    } catch (error) {
      log.error({ err: error }, 'await badRequestCount');
      ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
      return ctx.scene.leave();
    }
  },
  ctx => {
    if (
      ctx.update &&
      ctx.update.callback_query &&
      [SEARCH, FOUND].includes(ctx.update.callback_query.data)
    ) {
      ctx.session.userMessage.requestType = ctx.update.callback_query.data;
      ctx.reply(CREATE_REQUEST_MESSAGES.PHOTO);
      return ctx.wizard.next();
    }
    ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
    return ctx.scene.leave();
  },
  ctx => {
    if (ctx.message && ctx.message.photo) {
      ctx.session.userMessage.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      ctx.reply(CREATE_REQUEST_MESSAGES.LOCATION);
      return ctx.wizard.next();
    }
    ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
    return ctx.scene.leave();
  },
  ctx => {
    if (ctx.message && ctx.message.location) {
      ctx.session.userMessage.location = ctx.message.location;
      ctx.reply(CREATE_REQUEST_MESSAGES.DESCRIPTION);
      return ctx.wizard.next();
    }
    ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
    return ctx.scene.leave();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
      return ctx.scene.leave();
    }
    if (ctx.message.text.length > REQUEST_MESSAGE_MAX) {
      ctx.reply(CREATE_REQUEST_MESSAGES.MANY_LETTERS, mainMenu);
      return ctx.scene.leave();
    }
    try {
      const request = {
        platformId: ctx.message.from.id,
        platformType: TELEGRAM,
        userName: ctx.message.from.username,
        requestType: ctx.session.userMessage.requestType,
        longitude: ctx.session.userMessage.location.longitude,
        latitude: ctx.session.userMessage.location.latitude,
        photo: ctx.session.userMessage.photo,
        message: ctx.message.text,
      };
      await createRequest(request);
      ctx.reply(CREATE_REQUEST_MESSAGES.ENTER, mainMenu);
    } catch (error) {
      ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
      log.error({ err: error }, 'createRequestScene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
