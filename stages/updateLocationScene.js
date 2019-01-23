const WizardScene = require('telegraf/scenes/wizard');
const {
    CHANGE_LOCATION_SCENE_MESSAGE,
    REGISTRATION_ENTER,
    REGISTRATION_ERROR,
    EVENT_SCENE_UPDATE_LOCATION,
    PLATFORM_TYPE_TELEGRAM,
} = require('../config');
const { mainMenu } = require('../menu');
const { updateUserLocation } = require('../services');

const name = EVENT_SCENE_UPDATE_LOCATION;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(CHANGE_LOCATION_SCENE_MESSAGE);
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message || !ctx.message.location) {
            ctx.reply(REGISTRATION_ERROR, mainMenu);
            return ctx.scene.leave();
        }
        try {
            if (await updateUserLocation(
                ctx.message.from.id,
                PLATFORM_TYPE_TELEGRAM,
                ctx.message.location.latitude,
                ctx.message.location.longitude,
            )) { ctx.reply(REGISTRATION_ENTER, mainMenu); }
        } catch (error) {
            console.log(`updateScene ${error}`);
        }
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
