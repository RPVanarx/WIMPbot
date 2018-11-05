const Extra = require('telegraf/extra');

module.exports =  Extra.HTML().markup((m) =>
    m.inlineKeyboard([
        [m.callbackButton('Оновити свої gps координати', 'updateData')],
        [m.callbackButton('Подати заявку на пошук', 'createRequest')],
        [m.callbackButton('Отримати інфо про пошук тварин','getInfo')]
    ]));
