const Extra = require('telegraf/extra');
const {
    MAIN_MENU_BUTTON_REGISTRATION,
    MAIN_MENU_BUTTON_REQUEST,
    MAIN_MENU_BUTTON_SAMPLE,
    REGISTRATION_MENU_BUTTON_CHANGE_LOCATION,
    APPLY_MENU_CREATE_REQUEST,
    APPLY_MENU_DELETE,
    EVENT_REGISTRATION_MENU,
    EVENT_REQUEST_MENU,
    EVENT_SCENE_GET_INFO,
    EVENT_SCENE_REGISTRATION_USER,
    EVENT_SCENE_UPDATE_LOCATION,
    EVENT_SCENE_DEACTIVATE_USER,
    EVENT_SCENE_CREATE_REQUEST,
    EVENT_SCENE_DELETE_PET,
    YES,
    NO,
    SEARCH,
    FOUND,
    REGISTRATION_MENU_BUTTON_ACTIVATE_USER,
    EVENT_SCENE_ACTIVATE_USER,
    WELLCOME_MENU_BUTTON_REGISTRATION,
    REGISTRATION_MENU_BUTTON_DEACTIVATE_USER,
} = require('../../config');

const startRegistrationButton = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(WELLCOME_MENU_BUTTON_REGISTRATION, EVENT_SCENE_REGISTRATION_USER)],
]));

const mainMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(MAIN_MENU_BUTTON_REGISTRATION, EVENT_REGISTRATION_MENU)],
    [message.callbackButton(MAIN_MENU_BUTTON_REQUEST, EVENT_REQUEST_MENU)],
    [message.callbackButton(MAIN_MENU_BUTTON_SAMPLE, EVENT_SCENE_GET_INFO)],
]));

const registrationMenu = isActive => Extra.HTML().markup(m => m.inlineKeyboard([
    [m.callbackButton(REGISTRATION_MENU_BUTTON_CHANGE_LOCATION, EVENT_SCENE_UPDATE_LOCATION)],
    isActive
        ? [m.callbackButton(REGISTRATION_MENU_BUTTON_DEACTIVATE_USER, EVENT_SCENE_DEACTIVATE_USER)]
        : [m.callbackButton(REGISTRATION_MENU_BUTTON_ACTIVATE_USER, EVENT_SCENE_ACTIVATE_USER)],
]));

const applyMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(APPLY_MENU_CREATE_REQUEST, EVENT_SCENE_CREATE_REQUEST)],
    [message.callbackButton(APPLY_MENU_DELETE, EVENT_SCENE_DELETE_PET)],
]));

const yesNoQuestion = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(YES, 'yes')],
    [message.callbackButton(NO, 'no')],
]));

const searchFoundMenu = Extra.HTML().markup(message => message.inlineKeyboard([
    [message.callbackButton(SEARCH, 'search')],
    [message.callbackButton(FOUND, 'found')],
]));

module.exports = {
    mainMenu, registrationMenu, applyMenu, yesNoQuestion, startRegistrationButton, searchFoundMenu,
};
