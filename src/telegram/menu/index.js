const Extra = require('telegraf/extra');
const {
  MAIN_BUTTONS,
  REGISTRATION_BUTTONS,
  REQUESTS_BUTTONS,
  FIND_REQUESTS_BUTTON,
  FIND_REQUESTS_MESSAGES: { CB_NEW_LOCATION, CB_REGISTRATE_LOCATION },
  BUTTON_EVENT,
  EVENT_NAMES,
  BUTTON_MESSAGES,
  WELCOME_MENU_BUTTON_REGISTRATION,
} = require('../../config');

const startRegistrationButton = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(WELCOME_MENU_BUTTON_REGISTRATION, EVENT_NAMES.REGISTRATION_USER)],
  ]),
);

const mainMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(MAIN_BUTTONS.REGISTRATION, EVENT_NAMES.REGISTRATION_MENU)],
    [message.callbackButton(MAIN_BUTTONS.REQUEST, EVENT_NAMES.REQUEST_MENU)],
    [message.callbackButton(MAIN_BUTTONS.SAMPLE, EVENT_NAMES.FIND_REQUESTS)],
  ]),
);

const registrationMenu = isActive =>
  Extra.HTML().markup(m =>
    m.inlineKeyboard([
      [m.callbackButton(REGISTRATION_BUTTONS.CHANGE_LOCATION, EVENT_NAMES.UPDATE_LOCATION)],
      isActive
        ? [m.callbackButton(REGISTRATION_BUTTONS.DEACTIVATE_USER, EVENT_NAMES.DEACTIVATE_USER)]
        : [m.callbackButton(REGISTRATION_BUTTONS.ACTIVATE_USER, EVENT_NAMES.ACTIVATE_USER)],
    ]),
  );

const requestMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(REQUESTS_BUTTONS.CREATE_REQUEST, EVENT_NAMES.CREATE_REQUEST)],
    [message.callbackButton(REQUESTS_BUTTONS.DELETE_REQUEST, EVENT_NAMES.DELETE_REQUEST)],
  ]),
);

const yesNoQuestion = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(BUTTON_MESSAGES.YES, BUTTON_EVENT.YES)],
    [message.callbackButton(BUTTON_MESSAGES.NO, BUTTON_EVENT.NO)],
  ]),
);

const searchFoundMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(BUTTON_MESSAGES.SEARCH, BUTTON_EVENT.SEARCH)],
    [message.callbackButton(BUTTON_MESSAGES.FOUND, BUTTON_EVENT.FOUND)],
  ]),
);

const newOrRegistrateLocation = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(FIND_REQUESTS_BUTTON.USE_REG_LOCATION, CB_REGISTRATE_LOCATION)],
    [message.callbackButton(FIND_REQUESTS_BUTTON.USE_NEW_LOCATION, CB_NEW_LOCATION)],
  ]),
);

module.exports = {
  mainMenu,
  registrationMenu,
  requestMenu,
  yesNoQuestion,
  startRegistrationButton,
  searchFoundMenu,
  newOrRegistrateLocation,
};
