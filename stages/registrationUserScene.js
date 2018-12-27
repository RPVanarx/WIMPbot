const WizardScene = require('telegraf/scenes/wizard');
// const processing = require('../processing');
const { REGISTRATION_MESSAGE, REGISTRATION_ERROR, REGISTRATION_ENTER } = require('../config');
const { mainMenu } = require('../menu');

const name = 'registrationUserScene';
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(REGISTRATION_MESSAGE);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message && ctx.message.location) {
            userMessage = { id: 1 };
            userMessage.userId = ctx.message.from.id;
            userMessage.location = ctx.message.location;
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
