const Telegraf = require('telegraf');

const session = require('telegraf/session');
const {
    TOKEN, WELCOME_MESSAGE, REGISTRATION_MENU_MESSAGE, REQUEST_MENU_MESSAGE,
} = require('./config');

const bot = new Telegraf(TOKEN);
const { stage, stagesArray } = require('./stages');
const { mainMenu, registrationMenu, applyMenu } = require('./menu');

bot.use(session());
bot.use(stage.middleware());

stagesArray.forEach(scene => bot.action(scene.name, ctx => ctx.scene.enter(scene.name)));

bot.start(ctx => ctx.reply(WELCOME_MESSAGE, mainMenu));

bot.action('registration', ctx => ctx.reply(REGISTRATION_MENU_MESSAGE, registrationMenu));

bot.action('applyMenu', ctx => ctx.reply(REQUEST_MENU_MESSAGE, applyMenu));

bot.startPolling();
