const Extra = require('telegraf/extra');

const mainMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton('Зареєструватися або оновити свої координати', 'registration')],
    [message.callbackButton('Подати заявку на пошук', 'applyMenu')],
    [message.callbackButton('Отримати інфо про пошук тварин', 'getInfoScene')],
]));

const registrationMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton('Зареєструватися', 'registrationUserScene')],
    [message.callbackButton('Змінити свою локацію', 'changeLocationScene')],
    [message.callbackButton('Видалитися із системи', 'deleteUserScene')],
]));

const applyMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton('Я загубив улюбленця', 'searchPetScene')],
    [message.callbackButton('Я знайшов улюбленця', 'findPetScene')],
    [message.callbackButton('Видалити свою заявку', 'deletePetScene')],
]));

/* const yesNo = Extra.markup((markup)=>{
    return MediaStreamTrackAudioSourceNode.resize()
    .keyboard([
        markup.
    ])
}) */
module.exports = { mainMenu, registrationMenu, applyMenu };
