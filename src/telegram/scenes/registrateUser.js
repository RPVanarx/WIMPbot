const WizardScene = require('telegraf/scenes/wizard');
const {
  localesUA: { REGISTRATION_MESSAGES },
  telegramEvents: {
    SCENES: { REGISTRATION_USER: name },
  },
  platformType: { TELEGRAM },
} = require('../../config');
const { mainMenu, startRegistrationButton } = require('../menu');
const { create: registerUser } = require('../../services/user');
const log = require('../../logger')(__filename);

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(REGISTRATION_MESSAGES.CREATE);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.location) {
      ctx.reply(REGISTRATION_MESSAGES.ERROR, startRegistrationButton);
      return ctx.scene.leave();
    }
    try {
      await registerUser({
        platformId: ctx.message.from.id,
        platformType: TELEGRAM,
        longitude: ctx.message.location.longitude,
        latitude: ctx.message.location.latitude,
      });
      ctx.reply(REGISTRATION_MESSAGES.ENTER, mainMenu);
    } catch (error) {
      ctx.reply(REGISTRATION_MESSAGES.ERROR, startRegistrationButton);
      log.error({ err: error }, 'registrateUserScene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
