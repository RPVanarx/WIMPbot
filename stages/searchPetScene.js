const WizardScene = require('telegraf/scenes/wizard');
// const processing = require('../processing');
const {
    SEARCH_PET_SCENE_PHOTO_MESSAGE,
    SEARCH_PET_SCENE_LOCATION_MESSAGE,
    SEARCH_PET_SCENE_DESCRIPTION_MESSAGE,
    SEARCH_PET_SCENE_ERROR,
    REGISTRATION_ENTER,
    EVENT_SCENE_SEARCH_PET,
} = require('../config');
const { mainMenu } = require('../menu');

const name = EVENT_SCENE_SEARCH_PET;
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(SEARCH_PET_SCENE_PHOTO_MESSAGE);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message && ctx.message.photo) {
            ctx.reply(SEARCH_PET_SCENE_LOCATION_MESSAGE);
            userMessage = { id: 4 };
            userMessage.photo = ctx.message.photo[ctx.message.photo.length - 1];
            return ctx.wizard.next();
        }
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        return ctx.scene.leave();
    },
    (ctx) => {
        if (ctx.message && ctx.message.location) {
            ctx.reply(SEARCH_PET_SCENE_DESCRIPTION_MESSAGE);
            userMessage.location = ctx.message.location;
            return ctx.wizard.next();
        }
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        return ctx.scene.leave();
    },
    (ctx) => {
        if (ctx.message && ctx.message.text) {
            userMessage.description = ctx.message.text;
            userMessage.userId = ctx.message.from.id;
            // send to logic (userMessage)
            ctx.reply(REGISTRATION_ENTER, mainMenu);
            return ctx.scene.leave();
        }
        // processing(userMessage, ctx);
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
