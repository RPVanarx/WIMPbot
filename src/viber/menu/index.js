const KeyboardMessage = require('viber-bot').Message.Keyboard;

const phoneShare = new KeyboardMessage(
  {
    Type: 'keyboard',
    Buttons: [
      {
        ActionType: 'share-phone',
        ActionBody: 'reply',
        Text: 'Відправити свій номер телефону',
      },
      { ActionType: 'reply', ActionBody: 'returnMainMenu', Text: 'Повернутися в головне меню' },
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
      ActionBody: 'registrate',
      Text: 'Зареєструватися',
    },
  ],
};

const mainMenu = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'controlPanel',
      Text: 'Панель керування користувача',
    },
    {
      ActionType: 'reply',
      ActionBody: 'requestMenu',
      Text: 'Меню подачі заявки',
    },
    {
      ActionType: 'reply',
      ActionBody: 'findUsersRequests',
      Text: 'Переглянути загублених улюбленців',
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
        Text: 'Змінити власну локацію',
      },
      isActive
        ? {
            ActionType: 'reply',
            ActionBody: 'changeUserActivity:false',
            Text: 'Більше не отримувати заявок',
          }
        : {
            ActionType: 'reply',
            ActionBody: 'changeUserActivity:true',
            Text: 'Знову отримувати заявки',
          },
      { ActionType: 'reply', ActionBody: 'returnMainMenu', Text: 'Повернутися в головне меню' },
    ],
  };
};

const backMainMenu = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'returnMainMenu',
      Text: 'Повернутися в головне меню',
    },
  ],
};

const requestMenu = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'createRequest',
      Text: 'Створити заявку',
    },
    {
      ActionType: 'reply',
      ActionBody: 'closeOwnRequest',
      Text: 'Закрити власну заявку',
    },
    {
      ActionType: 'reply',
      ActionBody: 'returnMainMenu',
      Text: 'Повернутися в головне меню',
    },
  ],
};

const searchFoundMenu = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'requestType:search',
      Text: 'Я загубив улюбленця',
    },
    {
      ActionType: 'reply',
      ActionBody: 'requestType:found',
      Text: 'Я знайшов/бачив чийогось улюбленця',
    },
    {
      ActionType: 'reply',
      ActionBody: 'returnMainMenu',
      Text: 'Повернутися в головне меню',
    },
  ],
};

const deleteRequestButtons = arrayIdRequests => {
  const arrayButtons = [];
  arrayIdRequests.forEach(req => {
    arrayButtons.push({
      ActionType: 'reply',
      ActionBody: `closeRequest:${req.id}`,
      Text: `Закрити заявку ${req.id}`,
    });
  });
  arrayButtons.push({
    ActionType: 'reply',
    ActionBody: 'returnMainMenu',
    Text: 'Повернутися в головне меню',
  });
  return new KeyboardMessage({ Type: 'keyboard', Buttons: arrayButtons });
};

const locationChoise = {
  Type: 'keyboard',
  Buttons: [
    {
      ActionType: 'reply',
      ActionBody: 'locationChoise:registrLocation',
      Text: 'Використати реєстраційні координати',
    },
    {
      ActionType: 'reply',
      ActionBody: 'locationChoise:newLocation',
      Text: 'Ввести нові координати для вибірки',
    },
    {
      ActionType: 'reply',
      ActionBody: 'returnMainMenu',
      Text: 'Повернутися в головне меню',
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
