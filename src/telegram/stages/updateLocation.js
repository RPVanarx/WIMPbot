const WizardScene = require('telegraf/scenes/wizard');
const {
  CHANGE_LOCATION_MESSAGE,
  UPDATE_LOCATION_ENTER,
  UPDATE_LOCATION_ERROR,
  UPDATE_LOCATION,
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { mainMenu } = require('../menu');
const { registerUser } = require('../../services');

const name = UPDATE_LOCATION;

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(CHANGE_LOCATION_MESSAGE);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.location) {
      ctx.reply(UPDATE_LOCATION_ERROR, mainMenu);
      return ctx.scene.leave();
    }
    try {
      await registerUser({
        platformId: ctx.message.from.id,
        platformType: PLATFORM_TYPE_TELEGRAM,
        userName: ctx.message.from.username,
        longitude: ctx.message.location.longitude,
        latitude: ctx.message.location.latitude,
      });
      ctx.reply(UPDATE_LOCATION_ENTER, mainMenu);
    } catch (error) {
      ctx.reply(UPDATE_LOCATION_ERROR, mainMenu);
      console.log(`updateScene ${error}`);
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
