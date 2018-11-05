require('dotenv').config();
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);
const Extra = require('telegraf/extra');
const session = require('telegraf/session');
const {stage, stagesArray} = require('./stages');

bot.use(session());
bot.use(stage.middleware());

stagesArray.forEach((s) => bot.action(s.name, (ctx) => ctx.scene.enter(s.name)));

bot.start((ctx) => {
    ctx.reply('Вітаю, Ви завітали до WIMP бота, для початку роботи зі мною введіть Ваші геолокаційні дані');
    return ctx.reply('Включіть GPS на вашому телефоні та натисніть на кнопку що зявилась', Extra.markup((markup) => {
        return markup.resize()
            .keyboard([
                markup.locationRequestButton('Відправити координати')
            ]);
    }));
}
);

bot.on('location', (ctx) => {
    let user = {};
    user['id'] = ctx.message.from.id;
    user['latitude']= ctx.message.location.latitude;
    user['longitude'] = ctx.message.location.longitude; 
    console.log(user);
    return ctx.reply(`Дякую, Ваші геолокаційні дані записано, очікуйте на повідомлення про пошук
            Меню вибору дій`, Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            [m.callbackButton('Оновити свої gps координати', 'updateData')],
            [m.callbackButton('Подати заявку на пошук', 'createApp')],
            [m.callbackButton('Отримати інфо про пошук тварин','getInfo')]
        ])));
});     

bot.startPolling();