const WizardScene = require('telegraf/scenes/wizard');

const {
  FIND_REQUESTS_MESSAGES,
  EVENT_FIND_REQUESTS,
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { sendPhotoMessage } = require('../addFunctions');
const { mainMenu } = require('../menu');

const name = EVENT_FIND_REQUESTS;
const { getRequests } = require('../../services');

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
    ctx.session.userMessage.newRadius = Number.parseInt(ctx.message.text, 10);
    ctx.reply(FIND_REQUESTS_MESSAGES.DAYS);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.text || !/^\d+$/.test(ctx.message.text)) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      delete ctx.session.userMessage;
      return ctx.scene.leave();
    }
    try {
      const requests = await getRequests({
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
      setTimeout(() => ctx.reply('Вибірка завершена', mainMenu), 2000);
    } catch (error) {
      ctx.reply(FIND_REQUESTS_MESSAGES.ERROR, mainMenu);
      console.log(`getInfoScene ${error}`);
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
