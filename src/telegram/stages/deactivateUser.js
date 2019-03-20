const WizardScene = require('telegraf/scenes/wizard');
const {
  DEACTIVATE_USER,
  EVENT_NAMES: { DEACTIVATE_USER: name },
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { mainMenu, yesNoQuestion } = require('../menu');
const { changeUserActivity } = require('../../services');
const log = require('../../logger')(__filename);

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(DEACTIVATE_USER.QUESTION, yesNoQuestion);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!(ctx.update && ctx.update.callback_query && ctx.update.callback_query.data === 'yes')) {
      ctx.reply(DEACTIVATE_USER.FALSE, mainMenu);
      return ctx.scene.leave();
    }
    try {
      await changeUserActivity({
        platformId: ctx.update.callback_query.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
        value: false,
      });
      ctx.reply(DEACTIVATE_USER.TRUE, mainMenu);
    } catch (error) {
      ctx.reply(DEACTIVATE_USER.FALSE, mainMenu);
      log.error({ err: error.message, from: ctx.from.id }, 'deactivateUserScene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
