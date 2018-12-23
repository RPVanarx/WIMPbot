const Extra = require('telegraf/extra');

module.exports = Extra.HTML().markup(m => m.inlineKeyboard([
    [m.callbackButton('Зареєструватися', 'updateData')],
    [m.callbackButton('Змінити свою локацію', 'changeLocation')],
    [m.callbackButton('Видалитися із системи', 'deleteUser')],
]));
