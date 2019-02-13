const WizardScene = require('telegraf/scenes/wizard');
const {
  CHANGE_LOCATION_SCENE_MESSAGE,
  UPDATELOCATION_ENTER,
  UPDATELOCATION_ERROR,
  EVENT_SCENE_UPDATE_LOCATION,
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { mainMenu } = require('../menu');
const { registerUser } = require('../../services');

const name = EVENT_SCENE_UPDATE_LOCATION;

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(CHANGE_LOCATION_SCENE_MESSAGE);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.location) {
      ctx.reply(UPDATELOCATION_ERROR, mainMenu);
      return ctx.scene.leave();
    }
    try {
      await registerUser(
        ctx.message.from.id,
        PLATFORM_TYPE_TELEGRAM,
        ctx.message.from.username,
        ctx.message.location.longitude,
        ctx.message.location.latitude,
      );
      ctx.reply(UPDATELOCATION_ENTER, mainMenu);
    } catch (error) {
      ctx.reply(UPDATELOCATION_ERROR, mainMenu);
      console.log(`updateScene ${error}`);
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
