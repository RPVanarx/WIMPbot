const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Router = require('telegraf/router');
const {
    EVENT_REGISTRATION_MENU, EVENT_REQUEST_MENU,
    TOKEN, WELCOME_MESSAGE,
    REGISTRATION_MENU_MESSAGE,
    REQUEST_MENU_MESSAGE, PLATFORM_TYPE_TELEGRAM,
} = require('../config');
const { sendPhotoMessage } = require('./addFunctions');

const bot = new Telegraf(TOKEN);
const { stage, stagesArray } = require('./stages');
const { startRegistrationButton, registrationMenu, applyMenu } = require('./menu');
const {
    deleteRequest, userActivity, changeRequestActiveStatus, usersInRequestRadius,
} = require('../services');

bot.use(session());
bot.use(stage.middleware());

stagesArray.forEach(scene => bot.action(scene.name, ctx => ctx.scene.enter(scene.name)));

bot.start(ctx => ctx.reply(WELCOME_MESSAGE, startRegistrationButton));

bot.action(EVENT_REGISTRATION_MENU, async (ctx) => {
    ctx.reply(REGISTRATION_MENU_MESSAGE,
        registrationMenu(
            await userActivity(ctx.update.callback_query.from.id, PLATFORM_TYPE_TELEGRAM),
        ));
});

bot.action(EVENT_REQUEST_MENU, ctx => ctx.reply(REQUEST_MENU_MESSAGE, applyMenu));

/* async function qwe() {
    const link = await bot.telegram.getFileLink('');
    console.log(link);
    const extra = {};
    extra.caption = '';
    const response = await bot.telegram.sendPhoto(, '', extra);
    console.log(response);

    return link;
}
qwe();
*/

const callbackHandler = new Router(({ callbackQuery }) => {
    if (!callbackQuery.data) {
        return false;
    }
    const value = callbackQuery.data.split(':');
    return {
        route: value[0],
        state: {
            data: value[1],
            req: value[2],
        },
    };
});

callbackHandler.on('deleteRequest', async (ctx) => {
    try {
        await deleteRequest(ctx.state.data);
    } catch (error) {
        console.error(`deleteRequest ${error}`);
    }
});

/* callbackHandler.on('comment', async (ctx) => {
    console.log(ctx.state.data);
    try {
        await deleteRequest(ctx.state.data, ctx.state.id);
    } catch (error) {
        console.error(`deleteRequest ${error}`);
    }
}); */

callbackHandler.on('moderate', async (ctx) => {
    try {
        const request = await changeRequestActiveStatus(
            ctx.state.req,
            ctx.state.data,
            ctx.update.callback_query.from.id,
        );
        const users = await usersInRequestRadius(request.location);
        console.log(request);

        users.forEach(element => sendPhotoMessage(ctx, request, element.platform_id));
    } catch (error) {
        console.error(`moderate ${error}`);
    }
});

bot.on('callback_query', callbackHandler);

bot.startPolling();
