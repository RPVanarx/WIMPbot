const Extra = require('telegraf/extra');
const {
  localesUA: {
    MAIN_BUTTONS,
    REGISTRATION_BUTTONS,
    REQUESTS_BUTTONS,
    BUTTON_MESSAGES,
    WELCOME_MENU_BUTTON_REGISTRATION,
    FIND_REQUESTS_BUTTON,
  },
  telegramEvents: { SCENES, BUTTONS },
} = require('../../config');

const startRegistrationButton = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(WELCOME_MENU_BUTTON_REGISTRATION, SCENES.REGISTRATION_USER)],
  ]),
);

const mainMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(MAIN_BUTTONS.REGISTRATION, SCENES.REGISTRATION_MENU)],
    [message.callbackButton(MAIN_BUTTONS.REQUEST, SCENES.REQUEST_MENU)],
    [message.callbackButton(MAIN_BUTTONS.SAMPLE, SCENES.FIND_REQUESTS)],
  ]),
);

const registrationMenu = isActive =>
  Extra.HTML().markup(m =>
    m.inlineKeyboard([
      [m.callbackButton(REGISTRATION_BUTTONS.CHANGE_LOCATION, SCENES.UPDATE_LOCATION)],
      isActive
        ? [m.callbackButton(REGISTRATION_BUTTONS.DEACTIVATE_USER, SCENES.DEACTIVATE_USER)]
        : [m.callbackButton(REGISTRATION_BUTTONS.ACTIVATE_USER, SCENES.ACTIVATE_USER)],
    ]),
  );

const requestMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(REQUESTS_BUTTONS.CREATE_REQUEST, SCENES.CREATE_REQUEST)],
    [message.callbackButton(REQUESTS_BUTTONS.DELETE_REQUEST, SCENES.DELETE_REQUEST)],
  ]),
);

const yesNoQuestion = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(BUTTON_MESSAGES.YES, BUTTONS.YES)],
    [message.callbackButton(BUTTON_MESSAGES.NO, BUTTONS.NO)],
  ]),
);

const searchFoundMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(BUTTON_MESSAGES.SEARCH, BUTTONS.SEARCH)],
    [message.callbackButton(BUTTON_MESSAGES.FOUND, BUTTONS.FOUND)],
  ]),
);

const newOrRegistrateLocation = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(FIND_REQUESTS_BUTTON.USE_REG_LOCATION, BUTTONS.REGISTRATE_LOCATION)],
    [message.callbackButton(FIND_REQUESTS_BUTTON.USE_NEW_LOCATION, BUTTONS.NEW_LOCATION)],
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
