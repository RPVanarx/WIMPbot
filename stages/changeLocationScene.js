const WizardScene = require('telegraf/scenes/wizard');
// const processing = require('../processing');
const { CHANGE_LOCATION_SCENE_MESSAGE, REGISTRATION_ENTER, REGISTRATION_ERROR } = require('../config');
const mainMenu = require('../menu');

const name = 'changeLocationScene';
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(CHANGE_LOCATION_SCENE_MESSAGE);
        return ctx.wizard.next();
    },
    async (ctx) => {
        if ('location' in ctx.message) {
            userMessage = { id: 2 };
            userMessage.userId = ctx.message.from.id;
            userMessage.location = ctx.message.location;
            ctx.reply(REGISTRATION_ENTER, mainMenu);
            return ctx.scene.leave();
        }
        await ctx.reply(REGISTRATION_ERROR);
        // processing(userMessage, ctx);
        // send request (change user location) to business_logick
        return ctx.scene.reenter();
    },
);

module.exports = {
    name,
    scene,
};
