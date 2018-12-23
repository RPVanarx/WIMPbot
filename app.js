const Telegraf = require('telegraf');

const session = require('telegraf/session');
const config = require('./config');

const bot = new Telegraf(config.token);
const { stage, stagesArray } = require('./stages');
const menu = require('./menu');
const menu1 = require('./menu/registration');

bot.use(session());
bot.use(stage.middleware());

stagesArray.forEach(s => bot.action(s.name, ctx => ctx.scene.enter(s.name)));

bot.start(ctx => ctx.reply('Привіт, для початку роботи зі мною зареєструйтесь в системі', menu));
bot.on('registration', menu1);
bot.startPolling();
