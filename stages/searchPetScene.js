const WizardScene = require('telegraf/scenes/wizard');
const {
    SEARCH_PET_SCENE_PHOTO_MESSAGE,
    SEARCH_PET_SCENE_LOCATION_MESSAGE,
    SEARCH_PET_SCENE_DESCRIPTION_MESSAGE,
    SEARCH_PET_SCENE_ERROR,
    REGISTRATION_ENTER,
    EVENT_SCENE_SEARCH_PET,
    PLATFORM_TYPE_TELEGRAM,
    REQUEST_TYPE_SEARCH,
} = require('../config');
const { mainMenu } = require('../menu');
const { createRequest } = require('../services');

const name = EVENT_SCENE_SEARCH_PET;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(SEARCH_PET_SCENE_PHOTO_MESSAGE);
        ctx.session.userMessage = {};
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message && ctx.message.photo) {
            ctx.session.userMessage.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
            ctx.reply(SEARCH_PET_SCENE_LOCATION_MESSAGE);
            return ctx.wizard.next();
        }
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        delete ctx.session.userMessage;
        return ctx.scene.leave();
    },
    (ctx) => {
        if (ctx.message && ctx.message.location) {
            ctx.session.userMessage.location = ctx.message.location;
            ctx.reply(SEARCH_PET_SCENE_DESCRIPTION_MESSAGE);
            return ctx.wizard.next();
        }
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        delete ctx.session.userMessage;
        return ctx.scene.leave();
    },
    async (ctx) => {
        if (!ctx.message || !ctx.message.text) {
            ctx.reply(REGISTRATION_ENTER, mainMenu);
            delete ctx.session.userMessage;
            return ctx.scene.leave();
        }
        try {
            if (await createRequest(
                ctx.message.from.id,
                PLATFORM_TYPE_TELEGRAM,
                REQUEST_TYPE_SEARCH,
                ctx.session.userMessage.photo,
                ctx.message.text,
                ctx.session.userMessage.location.latitude,
                ctx.session.userMessage.location.longitude,
                ctx.update.message.date,
            )) {
                ctx.reply(REGISTRATION_ENTER, mainMenu);
            }
        } catch (error) {
            console.log(`searchPetScene ${error}`);
        }
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
