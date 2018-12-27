const WizardScene = require('telegraf/scenes/wizard');
// const processing = require('../processing');
const {
    FIND_PET_SCENE_PHOTO_MESSAGE,
    FIND_PET_SCENE_LOCATION_MESSAGE,
    FIND_PET_SCENE_DESCRIPTION_MESSAGE,
    SEARCH_PET_SCENE_ERROR,
    REGISTRATION_ENTER,
} = require('../config');
const { mainMenu } = require('../menu');

const name = 'findPetScene';
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(FIND_PET_SCENE_PHOTO_MESSAGE);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message && ctx.message.photo) {
            ctx.reply(FIND_PET_SCENE_LOCATION_MESSAGE);
            userMessage = { id: 5 };
            userMessage.photo = ctx.message.photo[ctx.message.photo.length - 1];
            return ctx.wizard.next();
        }
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        return ctx.scene.leave();
    },
    (ctx) => {
        if (ctx.message && ctx.message.location) {
            ctx.reply(FIND_PET_SCENE_DESCRIPTION_MESSAGE);
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
            // send userMessage to logic
            ctx.reply(REGISTRATION_ENTER, mainMenu);
            return ctx.scene.leave();
        }
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
