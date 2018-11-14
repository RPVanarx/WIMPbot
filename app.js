require('dotenv').config();
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);
const session = require('telegraf/session');
const { stage, stagesArray } = require('./stages');
const menu = require('./menu');

bot.use(session());
bot.use(stage.middleware());

stagesArray.forEach(s => bot.action(s.name, ctx => ctx.scene.enter(s.name)));

bot.start(ctx => ctx.reply('Привіт, для початку роботи зі мною зареєструйтесь в системі', menu));

bot.startPolling();
