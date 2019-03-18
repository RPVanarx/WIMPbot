require('dotenv').config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TOKEN,
  db: {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  },
  MODERATOR_GROUP_ID: process.env.MODERATORSID,

  WEB_AUTH_MAX_AUTH_PERIOD: process.env.WEB_AUTH_MAX_AUTH_PERIOD,
  WEB_PORT: process.env.WEB_PORT || 3003,
  WEB_API_V1_PREFIX: '/api/v1',
  WEB_API_JSON_ERROR_NAME: 'error',

  WEB_API_PATH_PHOTO: '/photo',
  WEB_API_PATH_REQUESTS: '/requests',
  WEB_API_PATH_LIST: '/list',

  DEFAULT_RADIUS: 1000,
  PLATFORM_TYPE_TELEGRAM: 'telegram',
  EVENT_REGISTRATION_MENU: 'registrationMenu',
  EVENT_REQUEST_MENU: 'requestMenu',
  EVENT_FIND_REQUESTS: 'findRequests',
  EVENT_REGISTRATION_USER: 'registrateUser',
  EVENT_UPDATE_LOCATION: 'updateLocation',
  EVENT_DEACTIVATE_USER: 'deactivateUser',
  EVENT_CREATE_REQUEST: 'createRequest',
  EVENT_DELETE_PET: 'closeOwnRequest',
  EVENT_ACTIVATE_USER: 'activateUser',
  WELCOME_MESSAGE: `Привіт, Ви приєдналися до чат-боту з пошуку загублених домашніх улюбленців, пропоную переглянути невелике відео щоб зрозуміти як зі мною працювати, а вже потім пройти швидку реєстрацію. 
https://www.youtube.com/watch?v=vASw0m6YdWs`,
  WELLCOME_MENU_BUTTON_REGISTRATION: 'Зареєструватися',

  MAIN_BUTTONS: {
    REGISTRATION: 'Панель керування користувача',
    REQUEST: 'Створити або закрити заявку',
    SAMPLE: 'Переглянути загублених улюбленців ',
  },

  REGISTRATION_BUTTONS: {
    CHANGE_LOCATION: 'Змінити свої координати',
    DEACTIVATE_USER: 'Не хочу отримувати повідомлення',
    ACTIVATE_USER: 'Хочу знову отримувати повідомлення',
  },

  REGISTRATION_MESSAGES: {
    CREATE: 'Відправте Вашу локацію використовуючи функцію месенджера',
    ERROR: 'Локація була введена невірно, спробуйте зареєструватися знову',
    ENTER: 'Ваш запит на реєстрацію прийнято',
  },

  YES: 'Так',
  NO: 'Ні',
  SEARCH: 'Я загубив улюбленця',
  FOUND: 'Я знайшов/бачив чийогось улюбленця',

  REQUESTS_BUTTONS: {
    CREATE_REQUEST: 'Створити заявку',
    DELETE_REQUEST: 'Закрити власну заявку',
  },

  DEACTIVATE_USER: {
    QUESTION: 'Ви впевнені що не бажаєте більше отримувати повідомлення про пошук?',
    TRUE: 'Ваш запит на відписку від повідомлень прийнято',
    FALSE: 'Відміна',
  },

  ACTIVATE_USER: {
    QUESTION: 'Ви впевнені що бажаєте знову отримувати повідомлення про пошук?',
    TRUE: 'Ваш запит на отримання повідомлень прийнято',
    FALSE: 'Відміна',
  },

  REGISTRATION_MENU_MESSAGE: 'Ви в панелі управління, виберіть один із пунктів',

  REQUEST_MENU_MESSAGE: 'Ви в меню подачі заявки, виберіть один із пунктів',

  UPDATE_LOCATION_MESSAGES: {
    UPDATE: 'Введіть ваші нові координати',
    ENTER: 'Ваш запит на зміну локації прийнято',
    ERROR: 'Локація була введена невірно, спробуйте зареєструватися знову',
  },

  CREATE_REQUEST_MESSAGES: {
    PHOTO: 'Завантажте фотографію улюбленця',
    LOCATION: 'Відправте локацію де улюбленець загубився/знайшовся',
    DESCRIPTION: 'Введіть невеликий опис одним повідомленням',
    ERROR: 'Помилка введення, спробуйте знову',
    ENTER: 'Ваша заявка відправлена на модерацію',
    CHOICE_TYPE: 'Виберіть один із пунктів',
    NO_USER_NAME:
      'Для того щоб відправити заявку, у вашому профілі має бути вказаний Username. Створіть власний Username та спробуйте відправити заявку знову',
    MANY_BAD_REQUESTS: 'Перевищено ліміт непідтверджених заявок',
  },

  FIND_REQUESTS_MESSAGES: {
    RADIUS:
      'В якому радіусі ви хочете отримати вибірку заявок (значення в метрах)? Приклади: 2000, 1200, 3500',
    DAYS:
      'На скільки старі заявки ви бажаєте отримати? (введіть кількість днів до 30-ти) Приклади: 5, 12, 25',
    ERROR: 'Помилка введення, спробуйте знову',
    NO_REQUESTS: 'Заявок для показу не знайдено',
  },

  CLOSE_OWN_REQUESTS_MESSAGES: {
    NO_REQUESTS: 'Ви не маєте активних заявок',
    CLOSE: 'Закрити заявку',
    SAMPLE_END: 'Вибірка завершена',
  },

  REQUEST_TYPE_FOUND: 'found',
  REQUEST_TYPE_SEARCH: 'search',
};
