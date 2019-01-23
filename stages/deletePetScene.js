const Extra = require('telegraf/extra');
const WizardScene = require('telegraf/scenes/wizard');
const {
    DELETE_PET_SCENE_MESSAGE,
    EVENT_SCENE_DELETE_PET,
    PLATFORM_TYPE_TELEGRAM,
    REQUEST_CLOSE,
} = require('../config');
const { userRequests } = require('../services');
const { mainMenu } = require('../menu');

const name = EVENT_SCENE_DELETE_PET;

const scene = new WizardScene(
    name,
    async (ctx) => {
        const requests = await userRequests(
            ctx.update.callback_query.from.id,
            PLATFORM_TYPE_TELEGRAM,
        );
        if (requests.length === 0) {
            ctx.reply(DELETE_PET_SCENE_MESSAGE, mainMenu);
            return ctx.scene.leave();
        }
        function callbackButtonDeleteRequest(value) {
            return Extra.HTML().markup(message => message.inlineKeyboard([
                [message.callbackButton(REQUEST_CLOSE, `${value}:delete`)],
            ]));
        }
        requests.forEach((req) => {
            ctx.reply(req, callbackButtonDeleteRequest(req));
        });
        return ctx.scene.leave();
    },

);

module.exports = {
    name,
    scene,
};
