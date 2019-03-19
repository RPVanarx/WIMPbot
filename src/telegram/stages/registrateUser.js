const WizardScene = require('telegraf/scenes/wizard');
const {
  REGISTRATION_MESSAGES,
  EVENT_NAMES: { REGISTRATION_USER: name },
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { mainMenu, startRegistrationButton } = require('../menu');
const { registerUser } = require('../../services');

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
        platformType: PLATFORM_TYPE_TELEGRAM,
        longitude: ctx.message.location.longitude,
        latitude: ctx.message.location.latitude,
      });
      ctx.reply(REGISTRATION_MESSAGES.ENTER, mainMenu);
    } catch (error) {
      ctx.reply(REGISTRATION_MESSAGES.ERROR, startRegistrationButton);
      console.log(`registrationScene ${error}`);
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
