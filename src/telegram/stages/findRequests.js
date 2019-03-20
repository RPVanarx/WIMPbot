const WizardScene = require('telegraf/scenes/wizard');

const {
  FIND_REQUESTS_MESSAGES,
  EVENT_NAMES: { FIND_REQUESTS: name },
  PLATFORM_TYPE_TELEGRAM,
  DEFAULT_VALUES,
} = require('../../config');
const { sendPhotoMessage } = require('../addFunctions');
const { mainMenu } = require('../menu');
const log = require('../../logger')(__filename);
const { getRequestsInRegLocation } = require('../../services');

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(FIND_REQUESTS_MESSAGES.RADIUS);
    ctx.session.userMessage = {};
    return ctx.wizard.next();
  },
  ctx => {
    if (!ctx.message || !ctx.message.text || !/^\d+$/.test(ctx.message.text)) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      delete ctx.session.userMessage;
      return ctx.scene.leave();
    }
    const radius = Number.parseInt(ctx.message.text, 10);
    if (radius < DEFAULT_VALUES.RADIUS_MIN || radius > DEFAULT_VALUES.RADIUS_MAX) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR_RADIUS, mainMenu);
      delete ctx.session.userMessage;
      return ctx.scene.leave();
    }
    ctx.session.userMessage.newRadius = radius;
    ctx.reply(FIND_REQUESTS_MESSAGES.DAYS);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.text || !/^\d+$/.test(ctx.message.text)) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      delete ctx.session.userMessage;
      return ctx.scene.leave();
    }
    const days = Number.parseInt(ctx.message.text, 10);
    if (days < DEFAULT_VALUES.DAYS_MIN || days > DEFAULT_VALUES.DAYS_MAX) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR_DAYS, mainMenu);
      delete ctx.session.userMessage;
      return ctx.scene.leave();
    }
    try {
      const requests = await getRequestsInRegLocation({
        platformId: ctx.message.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
        radius: ctx.session.userMessage.newRadius,
        days: Number.parseInt(ctx.message.text, 10),
      });
      if (requests.length === 0) {
        ctx.reply(FIND_REQUESTS_MESSAGES.NO_REQUESTS, mainMenu);
        return ctx.scene.leave();
      }
      await requests.forEach(req => {
        req.reqId = req.id;
        sendPhotoMessage({ ctx, request: req, chatId: ctx.message.from.id });
      });
      setTimeout(
        () => ctx.reply(FIND_REQUESTS_MESSAGES.SAMPLE_END, mainMenu),
        FIND_REQUESTS_MESSAGES.TIMEOUT,
      );
    } catch (error) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      log.error({ err: error.message, from: ctx.from.id }, 'findRequests Scene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
