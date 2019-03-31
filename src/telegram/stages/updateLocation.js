const WizardScene = require('telegraf/scenes/wizard');
const {
  UPDATE_LOCATION_MESSAGES,
  EVENT_NAMES: { UPDATE_LOCATION: name },
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { mainMenu } = require('../menu');
const { registerUser } = require('../../services');
const log = require('../../logger')(__filename);

const scene = new WizardScene(
  name,
  ctx => {
    ctx.reply(UPDATE_LOCATION_MESSAGES.UPDATE);
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message || !ctx.message.location) {
      ctx.reply(UPDATE_LOCATION_MESSAGES.ERROR, mainMenu);
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
      ctx.reply(UPDATE_LOCATION_MESSAGES.ENTER, mainMenu);
    } catch (error) {
      ctx.reply(UPDATE_LOCATION_MESSAGES.ERROR, mainMenu);
      log.error({ err: error.message }, 'UpdateLocationScene');
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};
