const WizardScene = require('telegraf/scenes/wizard');
const {
  CREATE_REQUEST_MESSAGES,
  EVENT_NAMES: { CREATE_REQUEST: name },
  PLATFORM_TYPE_TELEGRAM,
  MODERATOR_GROUP_ID,
  BUTTON_EVENT,
  DEFAULT_VALUES: { REQUEST_MESSAGE_MAX: textLimit },
} = require('../../config');
const { mainMenu, searchFoundMenu } = require('../menu');
const { createRequest, isUserCanCreateRequest } = require('../../services');
const { sendPhotoMessageToModerate } = require('../addFunctions');
const log = require('../../logger')(__filename);

const scene = new WizardScene(
  name,
  async ctx => {
    if (!ctx.update.callback_query.from.username) {
      ctx.reply(CREATE_REQUEST_MESSAGES.NO_USER_NAME, mainMenu);
      return ctx.scene.leave();
    }
    try {
      const status = await isUserCanCreateRequest({
        platformId: ctx.update.callback_query.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
      });
      if (status) {
        ctx.reply(CREATE_REQUEST_MESSAGES.CHOICE_TYPE, searchFoundMenu);
        ctx.session.userMessage = {};
        return ctx.wizard.next();
      }
      ctx.reply(CREATE_REQUEST_MESSAGES.MANY_BAD_REQUESTS, mainMenu);
      return ctx.scene.leave();
    } catch (error) {
      log.error({ err: error.message }, 'await badRequestCount');
      ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
      return ctx.scene.leave();
    }
  },
  ctx => {
    if (
      ctx.update &&
      ctx.update.callback_query &&
      [BUTTON_EVENT.SEARCH, BUTTON_EVENT.FOUND].includes(ctx.update.callback_query.data)
    ) {
      ctx.session.userMessage.requestType = ctx.update.callback_query.data;
      ctx.reply(CREATE_REQUEST_MESSAGES.PHOTO);
      return ctx.wizard.next();
    }

    ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
    delete ctx.session.userMessage;
    return ctx.scene.leave();
  },
  ctx => {
    if (ctx.message && ctx.message.photo) {
      ctx.session.userMessage.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      ctx.reply(CREATE_REQUEST_MESSAGES.LOCATION);
      return ctx.wizard.next();
    }
    ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
    delete ctx.session.userMessage;
    return ctx.scene.leave();
  },
  ctx => {
    if (ctx.message && ctx.message.location) {
      ctx.session.userMessage.location = ctx.message.location;
      ctx.reply(CREATE_REQUEST_MESSAGES.DESCRIPTION);
      return ctx.wizard.next();
    }
    ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
    delete ctx.session.userMessage;
    return ctx.scene.leave();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.text) {
      ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
      delete ctx.session.userMessage;
      return ctx.scene.leave();
    }
    if (ctx.message.text.length > textLimit) {
      ctx.reply(CREATE_REQUEST_MESSAGES.MANY_LETTERS, mainMenu);
      delete ctx.session.userMessage;
      return ctx.scene.leave();
    }
    try {
      const request = {
        platformId: ctx.message.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
        userName: ctx.message.from.username,
        requestType: ctx.session.userMessage.requestType,
        longitude: ctx.session.userMessage.location.longitude,
        latitude: ctx.session.userMessage.location.latitude,
        photo: ctx.session.userMessage.photo,
        message: ctx.message.text,
        creationDate: new Date(),
      };
      request.reqId = await createRequest(request);
      sendPhotoMessageToModerate({ request, moderatorId: MODERATOR_GROUP_ID });
      ctx.reply(CREATE_REQUEST_MESSAGES.ENTER, mainMenu);
    } catch (error) {
      ctx.reply(CREATE_REQUEST_MESSAGES.ERROR, mainMenu);
      log.error({ err: error.message }, 'createRequestScene');
    }
    delete ctx.session.userMessage;
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
