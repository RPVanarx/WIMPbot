const WizardScene = require('telegraf/scenes/wizard');
const {
    CREATE_REQUEST_SCENE_PHOTO_MESSAGE,
    CREATE_REQUEST_SCENE_LOCATION_MESSAGE,
    CREATE_REQUEST_SCENE_DESCRIPTION_MESSAGE,
    CREATE_REQUEST_SCENE_ERROR,
    CREATE_REQUEST_SCENE_ENTER,
    EVENT_SCENE_CREATE_REQUEST,
    PLATFORM_TYPE_TELEGRAM,
    CREATE_REQUEST_CHOICE_TYPE,
} = require('../../config');
const { mainMenu, searchFoundMenu } = require('../menu');
const { createRequest } = require('../../services');

const name = EVENT_SCENE_CREATE_REQUEST;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(CREATE_REQUEST_CHOICE_TYPE, searchFoundMenu);
        ctx.session.userMessage = {};
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.update && ctx.update.callback_query) {
            ctx.session.userMessage.requestType = ctx.update.callback_query.data;
            ctx.reply(CREATE_REQUEST_SCENE_PHOTO_MESSAGE);
            return ctx.wizard.next();
        }
        ctx.reply(CREATE_REQUEST_SCENE_ERROR, mainMenu);
        delete ctx.session.userMessage;
        return ctx.scene.leave();
    },
    (ctx) => {
        if (ctx.message && ctx.message.photo) {
            ctx.session.userMessage.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
            ctx.reply(CREATE_REQUEST_SCENE_LOCATION_MESSAGE);
            return ctx.wizard.next();
        }
        ctx.reply(CREATE_REQUEST_SCENE_ERROR, mainMenu);
        delete ctx.session.userMessage;
        return ctx.scene.leave();
    },
    (ctx) => {
        if (ctx.message && ctx.message.location) {
            ctx.session.userMessage.location = ctx.message.location;
            ctx.reply(CREATE_REQUEST_SCENE_DESCRIPTION_MESSAGE);
            return ctx.wizard.next();
        }
        ctx.reply(CREATE_REQUEST_SCENE_ERROR, mainMenu);
        delete ctx.session.userMessage;
        return ctx.scene.leave();
    },
    async (ctx) => {
        if (!ctx.message || !ctx.message.text) {
            ctx.reply(CREATE_REQUEST_SCENE_ERROR, mainMenu);
            delete ctx.session.userMessage;
            return ctx.scene.leave();
        }
        try {
            await createRequest(
                ctx.message.from.id,
                PLATFORM_TYPE_TELEGRAM,
                ctx.session.userMessage.requestType,
                ctx.session.userMessage.location.longitude,
                ctx.session.userMessage.location.latitude,
                ctx.session.userMessage.photo,
                ctx.message.text,
            );
            ctx.reply(CREATE_REQUEST_SCENE_ENTER, mainMenu);
        } catch (error) {
            ctx.reply(CREATE_REQUEST_SCENE_ERROR, mainMenu);
            console.log(`createPetScene ${error}`);
        }
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
