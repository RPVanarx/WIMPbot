const KeyboardMessage = require('viber-bot').Message.Keyboard;
const {
  FIND_REQUESTS_MESSAGES: { CB_NEW_LOCATION, CB_REGISTRATE_LOCATION },
  VIBER_TELEPHONE: { SHARE_NUMBER },
  VIBER_KEYBOARD,
  WELCOME_MENU_BUTTON_REGISTRATION,
  MAIN_BUTTONS,
  REGISTRATION_BUTTONS,
  REQUESTS_BUTTONS,
  BUTTON_MESSAGES,
  FIND_REQUESTS_BUTTON,
} = require('../../config');

const phoneShare = new KeyboardMessage(
  {
    Type: 'keyboard',
    Buttons: [
      {
        ActionType: 'share-phone',
        ActionBody: 'reply',
        Text: SHARE_NUMBER,
      },
      { ActionType: 'reply', ActionBody: 'returnMainMenu', Text: VIBER_KEYBOARD.BACK_MAIN_MENU },
    ],
  },
  undefined,
  undefined,
  undefined,
  3,
);

const registration = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'registrateUser',
      Text: WELCOME_MENU_BUTTON_REGISTRATION,
    },
  ],
};

const mainMenu = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'controlPanel',
      Text: MAIN_BUTTONS.REGISTRATION,
    },
    {
      ActionType: 'reply',
      ActionBody: 'requestMenu',
      Text: MAIN_BUTTONS.REQUEST,
    },
    {
      ActionType: 'reply',
      ActionBody: 'findUsersRequests',
      Text: MAIN_BUTTONS.SAMPLE,
    },
  ],
};

const controlPanel = isActive => {
  return {
    Type: 'keyboard',
    Buttons: [
      {
        ActionType: 'reply',
        ActionBody: 'updateLocation',
        Text: REGISTRATION_BUTTONS.CHANGE_LOCATION,
      },
      isActive
        ? {
            ActionType: 'reply',
            ActionBody: 'changeUserActivity:false',
            Text: REGISTRATION_BUTTONS.DEACTIVATE_USER,
          }
        : {
            ActionType: 'reply',
            ActionBody: 'changeUserActivity:true',
            Text: REGISTRATION_BUTTONS.ACTIVATE_USER,
          },
      { ActionType: 'reply', ActionBody: 'returnMainMenu', Text: VIBER_KEYBOARD.BACK_MAIN_MENU },
    ],
  };
};

const backMainMenu = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'returnMainMenu',
      Text: VIBER_KEYBOARD.BACK_MAIN_MENU,
    },
  ],
};

const requestMenu = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'createRequest',
      Text: REQUESTS_BUTTONS.CREATE_REQUEST,
    },
    {
      ActionType: 'reply',
      ActionBody: 'closeOwnRequest',
      Text: REQUESTS_BUTTONS.DELETE_REQUEST,
    },
    {
      ActionType: 'reply',
      ActionBody: 'returnMainMenu',
      Text: VIBER_KEYBOARD.BACK_MAIN_MENU,
    },
  ],
};

const searchFoundMenu = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'requestType:search',
      Text: BUTTON_MESSAGES.SEARCH,
    },
    {
      ActionType: 'reply',
      ActionBody: 'requestType:found',
      Text: BUTTON_MESSAGES.FOUND,
    },
    {
      ActionType: 'reply',
      ActionBody: 'returnMainMenu',
      Text: VIBER_KEYBOARD.BACK_MAIN_MENU,
    },
  ],
};

const deleteRequestButtons = arrayIdRequests => {
  const arrayButtons = [];
  arrayIdRequests.forEach(req => {
    arrayButtons.push({
      ActionType: 'reply',
      ActionBody: `closeRequest:${req.id}`,
      Text: `${VIBER_KEYBOARD.CLOSE_REQUEST} ${req.id}`,
    });
  });
  arrayButtons.push({
    ActionType: 'reply',
    ActionBody: 'returnMainMenu',
    Text: VIBER_KEYBOARD.BACK_MAIN_MENU,
  });
  return { Type: 'keyboard', Buttons: arrayButtons };
};

const locationChoise = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: `locationChoise:${CB_REGISTRATE_LOCATION}`,
      Text: FIND_REQUESTS_BUTTON.USE_REG_LOCATION,
    },
    {
      ActionType: 'reply',
      ActionBody: `locationChoise:${CB_NEW_LOCATION}`,
      Text: FIND_REQUESTS_BUTTON.USE_NEW_LOCATION,
    },
    {
      ActionType: 'reply',
      ActionBody: 'returnMainMenu',
      Text: VIBER_KEYBOARD.BACK_MAIN_MENU,
    },
  ],
};

module.exports = {
  phoneShare,
  registration,
  mainMenu,
  controlPanel,
  backMainMenu,
  requestMenu,
  searchFoundMenu,
  deleteRequestButtons,
  locationChoise,
};
