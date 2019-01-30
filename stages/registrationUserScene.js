const WizardScene = require('telegraf/scenes/wizard');
const {
    REGISTRATION_MESSAGE,
    REGISTRATION_ERROR,
    REGISTRATION_ENTER,
    EVENT_SCENE_REGISTRATION_USER,
    PLATFORM_TYPE_TELEGRAM,
} = require('../config');
const { mainMenu, startRegistrationButton } = require('../menu');
const { registerUser } = require('../services');

const name = EVENT_SCENE_REGISTRATION_USER;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(REGISTRATION_MESSAGE);
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message || !ctx.message.location) {
            ctx.reply(REGISTRATION_ERROR, startRegistrationButton);
            return ctx.scene.leave();
        }
        try {
            if (await registerUser(
                ctx.message.from.id,
                PLATFORM_TYPE_TELEGRAM,
                ctx.message.from.username,
                ctx.message.location.latitude,
                ctx.message.location.longitude,
            )) {
                ctx.reply(REGISTRATION_ENTER, mainMenu);
            }
        } catch (error) {
            console.log(`registrationScene ${error}`);
        }
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
