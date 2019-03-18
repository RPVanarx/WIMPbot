const Extra = require('telegraf/extra');
const {
  MAIN_BUTTONS,
  REGISTRATION_BUTTONS,
  REQUESTS_BUTTONS,
  EVENT_REGISTRATION_MENU,
  EVENT_REQUEST_MENU,
  EVENT_FIND_REQUESTS,
  EVENT_REGISTRATION_USER,
  EVENT_UPDATE_LOCATION,
  EVENT_DEACTIVATE_USER,
  EVENT_CREATE_REQUEST,
  EVENT_DELETE_PET,
  YES,
  NO,
  SEARCH,
  FOUND,
  EVENT_ACTIVATE_USER,
  WELLCOME_MENU_BUTTON_REGISTRATION,
} = require('../../config');

const startRegistrationButton = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(WELLCOME_MENU_BUTTON_REGISTRATION, EVENT_REGISTRATION_USER)],
  ]),
);

const mainMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(MAIN_BUTTONS.REGISTRATION, EVENT_REGISTRATION_MENU)],
    [message.callbackButton(MAIN_BUTTONS.REQUEST, EVENT_REQUEST_MENU)],
    [message.callbackButton(MAIN_BUTTONS.SAMPLE, EVENT_FIND_REQUESTS)],
  ]),
);

const registrationMenu = isActive =>
  Extra.HTML().markup(m =>
    m.inlineKeyboard([
      [m.callbackButton(REGISTRATION_BUTTONS.CHANGE_LOCATION, EVENT_UPDATE_LOCATION)],
      isActive
        ? [m.callbackButton(REGISTRATION_BUTTONS.DEACTIVATE_USER, EVENT_DEACTIVATE_USER)]
        : [m.callbackButton(REGISTRATION_BUTTONS.ACTIVATE_USER, EVENT_ACTIVATE_USER)],
    ]),
  );

const applyMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(REQUESTS_BUTTONS.CREATE_REQUEST, EVENT_CREATE_REQUEST)],
    [message.callbackButton(REQUESTS_BUTTONS.DELETE_REQUEST, EVENT_DELETE_PET)],
  ]),
);

const yesNoQuestion = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(YES, 'yes')],
    [message.callbackButton(NO, 'no')],
  ]),
);

const searchFoundMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(SEARCH, 'search')],
    [message.callbackButton(FOUND, 'found')],
  ]),
);

module.exports = {
  mainMenu,
  registrationMenu,
  applyMenu,
  yesNoQuestion,
  startRegistrationButton,
  searchFoundMenu,
};
