const WizardScene = require('telegraf/scenes/wizard');
const {
  REGISTRATION_MESSAGE,
  REGISTRATION_ERROR,
  REGISTRATION_ENTER,
  EVENT_REGISTRATION_USER,
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { mainMenu, startRegistrationButton } = require('../menu');
const { registerUser } = require('../../services');

const name = EVENT_REGISTRATION_USER;

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(REGISTRATION_MESSAGE);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.location) {
      ctx.reply(REGISTRATION_ERROR, startRegistrationButton);
      return ctx.scene.leave();
    }
    try {
      await registerUser({
        platformId: ctx.message.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
        longitude: ctx.message.location.longitude,
        latitude: ctx.message.location.latitude,
      });
      ctx.reply(REGISTRATION_ENTER, mainMenu);
    } catch (error) {
      ctx.reply(REGISTRATION_ERROR, startRegistrationButton);
      console.log(`registrationScene ${error}`);
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
