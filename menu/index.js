const Extra = require('telegraf/extra');
const {
    MAIN_MENU_BUTTON_REGISTRATION,
    MAIN_MENU_BUTTON_REQUEST,
    MAIN_MENU_BUTTON_SAMPLE,
    REGISTRATION_MENU_BUTTON_REGISTRATION,
    REGISTRATION_MENU_BUTTON_CHANGE_LOCATION,
    REGISTRATION_MENU_BUTTON_DELETE_USER,
    APPLY_MENU_SEARCH,
    APPLY_MENU_FIND,
    APPLY_MENU_DELETE,
} = require('../config');

const mainMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(MAIN_MENU_BUTTON_REGISTRATION, 'registration')],
    [message.callbackButton(MAIN_MENU_BUTTON_REQUEST, 'applyMenu')],
    [message.callbackButton(MAIN_MENU_BUTTON_SAMPLE, 'getInfoScene')],
]));

const registrationMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(REGISTRATION_MENU_BUTTON_REGISTRATION, 'registrationUserScene')],
    [message.callbackButton(REGISTRATION_MENU_BUTTON_CHANGE_LOCATION, 'changeLocationScene')],
    [message.callbackButton(REGISTRATION_MENU_BUTTON_DELETE_USER, 'deleteUserScene')],
]));

const applyMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(APPLY_MENU_SEARCH, 'searchPetScene')],
    [message.callbackButton(APPLY_MENU_FIND, 'findPetScene')],
    [message.callbackButton(APPLY_MENU_DELETE, 'deletePetScene')],
]));

/* const yesNo = Extra.markup((markup)=>{
    return MediaStreamTrackAudioSourceNode.resize()
    .keyboard([
        markup.
    ])
}) */
module.exports = { mainMenu, registrationMenu, applyMenu };
