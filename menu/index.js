const Extra = require('telegraf/extra');

module.exports = Extra.HTML().markup(m => m.inlineKeyboard([
    [m.callbackButton('Зареєструватися або оновити свої координати', 'registration')],
    [m.callbackButton('Подати заявку на пошук', 'createRequest')],
    [m.callbackButton('Отримати інфо про пошук тварин', 'getInfo')],
]));
