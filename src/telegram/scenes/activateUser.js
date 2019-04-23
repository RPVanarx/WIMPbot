const WizardScene = require('telegraf/scenes/wizard');
const {
  localesUA: { ACTIVATE_USER },
  telegramEvents: {
    SCENES: { ACTIVATE_USER: name },
    BUTTONS: { YES },
  },
  platformType: { TELEGRAM },
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
    if (!(ctx.update && ctx.update.callback_query && ctx.update.callback_query.data === YES)) {
      ctx.reply(ACTIVATE_USER.FALSE, mainMenu);
      return ctx.scene.leave();
    }
    try {
      await changeUserActivity({
        platformId: ctx.update.callback_query.from.id,
        platformType: TELEGRAM,
        value: true,
      });
      ctx.reply(ACTIVATE_USER.TRUE, mainMenu);
    } catch (error) {
      ctx.reply(ACTIVATE_USER.FALSE, mainMenu);
      log.error({ err: error }, 'activateUserScene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
