const WizardScene = require('telegraf/scenes/wizard');
// const processing = require('../processing');
const {
    CHANGE_LOCATION_SCENE_MESSAGE,
    REGISTRATION_ENTER,
    REGISTRATION_ERROR,
    EVENT_SCENE_UPDATE_LOCATION,
} = require('../config');
const { mainMenu } = require('../menu');

const name = EVENT_SCENE_UPDATE_LOCATION;
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(CHANGE_LOCATION_SCENE_MESSAGE);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message && ctx.message.location) {
            userMessage = { id: 2 };
            userMessage.userId = ctx.message.from.id;
            userMessage.location = ctx.message.location;
            ctx.reply(REGISTRATION_ENTER, mainMenu);
            return ctx.scene.leave();
        }
        ctx.reply(REGISTRATION_ERROR, mainMenu);
        // processing(userMessage, ctx);
        // send request (change user location) to business_logick
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
