const WizardScene = require('telegraf/scenes/wizard');
const { DEACTIVATE_USER, EVENT_DEACTIVATE_USER, PLATFORM_TYPE_TELEGRAM } = require('../../config');
const { mainMenu, yesNoQuestion } = require('../menu');
const { changeUserActivity } = require('../../services');

const name = EVENT_DEACTIVATE_USER;

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
      console.log(`deleteUserScene ${error}`);
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
