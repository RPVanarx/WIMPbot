const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Router = require('telegraf/router');
const {
    EVENT_REGISTRATION_MENU, EVENT_REQUEST_MENU,
    TOKEN, WELCOME_MESSAGE,
    REGISTRATION_MENU_MESSAGE,
    REQUEST_MENU_MESSAGE, PLATFORM_TYPE_TELEGRAM,
} = require('../config');


const bot = new Telegraf(TOKEN);
const { stage, stagesArray } = require('./stages');
const { startRegistrationButton, registrationMenu, applyMenu } = require('./menu');
const { deleteRequest, userActivity } = require('../services');

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
        },
    };
});

callbackHandler.on('deleteRequest', async (ctx) => {
    try {
        await deleteRequest(ctx.state.data);
    } catch (error) {
        console.error(error);
    }
});

bot.on('callback_query', callbackHandler);

bot.startPolling();
