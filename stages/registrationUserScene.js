const WizardScene = require('telegraf/scenes/wizard');
const {
    REGISTRATION_MESSAGE,
    REGISTRATION_ERROR,
    REGISTRATION_ENTER,
    EVENT_SCENE_REGISTRATION_USER,
} = require('../config');
const { mainMenu } = require('../menu');
const { registerUser } = require('../services');

const name = EVENT_SCENE_REGISTRATION_USER;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(REGISTRATION_MESSAGE);
        return ctx.wizard.next();
    },
    async (ctx) => {
        let message = REGISTRATION_ERROR;
        if (ctx.message && ctx.message.location) {
            try {
                if (await registerUser(
                    ctx.message.from.id,
                    ctx.message.from.username,
                    'telegramm',
                    ctx.message.location.latitude,
                    ctx.message.location.longitude,
                )) { message = REGISTRATION_ENTER; }
            } catch (error) {
                console.log(`registrationScene ${error}`);
            }
        }
        ctx.reply(message, mainMenu);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
