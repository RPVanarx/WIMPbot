const Extra = require('telegraf/extra');

module.exports = Extra.HTML().markup(m => m.inlineKeyboard([
    [m.callbackButton('Я загубив улюбленця', 'registration')],
    [m.callbackButton('Я знайшов улюбленця', 'changeLocation')],
    [m.callbackButton('Видалити свою заявку', 'deleteUser')],
]));
