const WizardScene = require('telegraf/scenes/wizard');

const {
  FIND_REQUESTS_MESSAGES,
  EVENT_NAMES: { FIND_REQUESTS: name },
  PLATFORM_TYPE_TELEGRAM,
  DEFAULT_VALUES,
} = require('../../config');
const { mainMenu, newOrRegistrateLocation } = require('../menu');
const log = require('../../logger')(__filename);
const { getRequestsInRegLocation, getRequestsInArea, sendPhotoMessage } = require('../../services');

const scene = new WizardScene(
  name,
  ctx => {
    delete ctx.session.userMessage;
    ctx.reply(FIND_REQUESTS_MESSAGES.QUESTION_LOCATION, newOrRegistrateLocation);
    return ctx.wizard.next();
  },
  ctx => {
    ctx.session.userMessage = {};
    if (
      !ctx.update ||
      !ctx.update.callback_query ||
      ![
        FIND_REQUESTS_MESSAGES.CB_NEW_LOCATION,
        FIND_REQUESTS_MESSAGES.CB_REGISTRATE_LOCATION,
      ].includes(ctx.update.callback_query.data)
    ) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      return ctx.scene.leave();
    }
    if (ctx.update.callback_query.data === FIND_REQUESTS_MESSAGES.CB_REGISTRATE_LOCATION) {
      ctx.reply(FIND_REQUESTS_MESSAGES.RADIUS);
      return ctx.wizard.selectStep(ctx.wizard.cursor + 2);
    }
    ctx.session.userMessage.location = true;
    ctx.reply(FIND_REQUESTS_MESSAGES.LOCATION);
    return ctx.wizard.next();
  },
  ctx => {
    if (!ctx.message || !ctx.message.location) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      return ctx.scene.leave();
    }
    ctx.session.userMessage.location = ctx.message.location;
    ctx.reply(FIND_REQUESTS_MESSAGES.NEW_LOCATION_RADIUS);
    return ctx.wizard.next();
  },
  ctx => {
    if (!ctx.message || !ctx.message.text || !/^\d+$/.test(ctx.message.text)) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      return ctx.scene.leave();
    }
    const radius = Number.parseInt(ctx.message.text, 10);
    if (radius < DEFAULT_VALUES.RADIUS_MIN || radius > DEFAULT_VALUES.RADIUS_MAX) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR_RADIUS, mainMenu);
      return ctx.scene.leave();
    }
    ctx.session.userMessage.newRadius = radius;
    ctx.reply(FIND_REQUESTS_MESSAGES.DAYS);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.text || !/^\d+$/.test(ctx.message.text)) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      return ctx.scene.leave();
    }
    const days = Number.parseInt(ctx.message.text, 10);
    if (days < DEFAULT_VALUES.DAYS_MIN || days > DEFAULT_VALUES.DAYS_MAX) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR_DAYS, mainMenu);
      return ctx.scene.leave();
    }
    try {
      let requests;
      if (!ctx.session.userMessage.location) {
        requests = await getRequestsInRegLocation({
          platformId: ctx.message.from.id,
          platformType: PLATFORM_TYPE_TELEGRAM,
          radius: ctx.session.userMessage.newRadius,
          days: Number.parseInt(ctx.message.text, 10),
        });
      }
      if (ctx.session.userMessage.location) {
        requests = await getRequestsInArea({
          longitude: ctx.session.userMessage.location.longitude,
          latitude: ctx.session.userMessage.location.latitude,
          radius: ctx.session.userMessage.newRadius,
          days: Number.parseInt(ctx.message.text, 10),
        });
      }
      if (requests.length === 0) {
        ctx.reply(FIND_REQUESTS_MESSAGES.NO_REQUESTS, mainMenu);
        return ctx.scene.leave();
      }
      await requests.forEach(req => {
        sendPhotoMessage({
          userRequest: req,
          platformType: PLATFORM_TYPE_TELEGRAM,
          photo: req.photo,
          chatId: ctx.message.from.id,
        });
      });
      setTimeout(
        () => ctx.reply(FIND_REQUESTS_MESSAGES.SAMPLE_END, mainMenu),
        FIND_REQUESTS_MESSAGES.TIMEOUT,
      );
    } catch (error) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      log.error({ err: error }, 'findRequests Scene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
