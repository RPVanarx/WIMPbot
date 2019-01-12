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
    EVENT_REGISTRATION_MENU,
    EVENT_REQUEST_MENU,
    EVENT_SCENE_GET_INFO,
    EVENT_SCENE_REGISTRATION_USER,
    EVENT_SCENE_UPDATE_LOCATION,
    EVENT_SCENE_DELETE_USER,
    EVENT_SCENE_SEARCH_PET,
    EVENT_SCENE_FIND_PET,
    EVENT_SCENE_DELETE_PET,
} = require('../config');

const mainMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(MAIN_MENU_BUTTON_REGISTRATION, EVENT_REGISTRATION_MENU)],
    [message.callbackButton(MAIN_MENU_BUTTON_REQUEST, EVENT_REQUEST_MENU)],
    [message.callbackButton(MAIN_MENU_BUTTON_SAMPLE, EVENT_SCENE_GET_INFO)],
]));

const registrationMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(REGISTRATION_MENU_BUTTON_REGISTRATION, EVENT_SCENE_REGISTRATION_USER)],
    [message.callbackButton(REGISTRATION_MENU_BUTTON_CHANGE_LOCATION, EVENT_SCENE_UPDATE_LOCATION)],
    [message.callbackButton(REGISTRATION_MENU_BUTTON_DELETE_USER, EVENT_SCENE_DELETE_USER)],
]));

const applyMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(APPLY_MENU_SEARCH, EVENT_SCENE_SEARCH_PET)],
    [message.callbackButton(APPLY_MENU_FIND, EVENT_SCENE_FIND_PET)],
    [message.callbackButton(APPLY_MENU_DELETE, EVENT_SCENE_DELETE_PET)],
]));

/* const yesNo = Extra.markup((markup)=>{
    return MediaStreamTrackAudioSourceNode.resize()
    .keyboard([
        markup.
    ])
}) */
module.exports = { mainMenu, registrationMenu, applyMenu };
