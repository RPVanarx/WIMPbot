const WizardScene = require('telegraf/scenes/wizard');

const {
  localesUA: { FIND_REQUESTS_MESSAGES },
  telegramEvents: {
    SCENES: { FIND_REQUESTS: name },
    BUTTONS: { NEW_LOCATION, REGISTRATE_LOCATION },
  },
  platformType: { TELEGRAM },
  defaultValues: { RADIUS_MIN, RADIUS_MAX, DAYS_MIN, DAYS_MAX, TIMEOUT_TELEGRAM_SAMPLE },
} = require('../../config');
const { mainMenu, newOrRegistrateLocation } = require('../menu');
const log = require('../../logger')(__filename);
const {
  request: { getRequestsInRegLocation, getRequestsInArea },
  message: { sendPhotoMessage },
} = require('../../services');

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
      ![NEW_LOCATION, REGISTRATE_LOCATION].includes(ctx.update.callback_query.data)
    ) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      return ctx.scene.leave();
    }
    if (ctx.update.callback_query.data === REGISTRATE_LOCATION) {
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
    if (radius < RADIUS_MIN || radius > RADIUS_MAX) {
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
    if (days < DAYS_MIN || days > DAYS_MAX) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR_DAYS, mainMenu);
      return ctx.scene.leave();
    }
    try {
      let requests;
      if (!ctx.session.userMessage.location) {
        requests = await getRequestsInRegLocation({
          platformId: ctx.message.from.id,
          platformType: TELEGRAM,
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
          platformType: TELEGRAM,
          photo: req.photo,
          chatId: ctx.message.from.id,
        });
      });
      setTimeout(
        () => ctx.reply(FIND_REQUESTS_MESSAGES.SAMPLE_END, mainMenu),
        TIMEOUT_TELEGRAM_SAMPLE,
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
