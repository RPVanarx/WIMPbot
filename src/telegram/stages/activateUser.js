const WizardScene = require('telegraf/scenes/wizard');
const {
  ACTIVATE_USER,
  EVENT_NAMES: { ACTIVATE_USER: name },
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { mainMenu, yesNoQuestion } = require('../menu');
const { changeUserActivity } = require('../../services');
const log = require('../../logger')(__filename);

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(ACTIVATE_USER.QUESTION, yesNoQuestion);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!(ctx.update && ctx.update.callback_query && ctx.update.callback_query.data === 'yes')) {
      ctx.reply(ACTIVATE_USER.FALSE, mainMenu);
      return ctx.scene.leave();
    }
    try {
      await changeUserActivity({
        platformId: ctx.update.callback_query.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
        value: true,
      });
      ctx.reply(ACTIVATE_USER.TRUE, mainMenu);
    } catch (error) {
      ctx.reply(ACTIVATE_USER.FALSE, mainMenu);
      log.error({ err: error.message }, 'activateUserScene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
