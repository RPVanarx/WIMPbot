const WizardScene = require('telegraf/scenes/wizard');
const {
  localesUA: { DEACTIVATE_USER },
  telegramEvents: {
    SCENES: { DEACTIVATE_USER: name },
    BUTTONS: { YES },
  },
  platformType: { TELEGRAM },
} = require('../../config');
const { mainMenu, yesNoQuestion } = require('../menu');
const { changeUserActivity } = require('../../services/user');
const log = require('../../logger')(__filename);

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(DEACTIVATE_USER.QUESTION, yesNoQuestion);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!(ctx.update && ctx.update.callback_query && ctx.update.callback_query.data === YES)) {
      ctx.reply(DEACTIVATE_USER.FALSE, mainMenu);
      return ctx.scene.leave();
    }
    try {
      await changeUserActivity({
        platformId: ctx.update.callback_query.from.id,
        platformType: TELEGRAM,
        value: false,
      });
      ctx.reply(DEACTIVATE_USER.TRUE, mainMenu);
    } catch (error) {
      ctx.reply(DEACTIVATE_USER.FALSE, mainMenu);
      log.error({ err: error }, 'deactivateUserScene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
