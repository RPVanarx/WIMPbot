const WizardScene = require('telegraf/scenes/wizard');
// const processing = require('../processing');
const {
    REGISTRATION_MESSAGE,
    REGISTRATION_ERROR,
    REGISTRATION_ENTER,
    EVENT_SCENE_REGISTRATION_USER,
} = require('../config');
const { mainMenu } = require('../menu');
const { registerUser } = require('../services');

const name = EVENT_SCENE_REGISTRATION_USER;
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(REGISTRATION_MESSAGE);
        return ctx.wizard.next();
    },
    (ctx) => {
        console.log(ctx.message);
        if (ctx.message && ctx.message.location) {
            userMessage = {};
            userMessage.id = ctx.message.from.id;
            userMessage.location = ctx.message.location;
            // registerUser(userMessage);
            ctx.reply(REGISTRATION_ENTER, mainMenu);
            return ctx.scene.leave();
        }
        ctx.reply(REGISTRATION_ERROR, mainMenu);
        // processing(userMessage, ctx);
        // send request (create user and location) to business_logick
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
