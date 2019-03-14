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
  WEB_API_PATH_REQUEST: '/request',

  DEFAULT_RADIUS: 1000,
  PLATFORM_TYPE_TELEGRAM: 'telegram',
  EVENT_REGISTRATION_MENU: 'registrationMenu',
  EVENT_REQUEST_MENU: 'requestMenu',
  EVENT_FIND_REQUESTS: 'findRequests',
  EVENT_REGISTRATION_USER: 'registrateUser',
  UPDATE_LOCATION: 'updateLocation',
  EVENT_DEACTIVATE_USER: 'deactivateUser',
  EVENT_CREATE_REQUEST: 'createRequest',
  EVENT_DELETE_PET: 'closeOwnRequest',
  EVENT_ACTIVATE_USER: 'activateUser',
  WELCOME_MESSAGE: `Привіт, Ви приєдналися до чат-боту з пошуку загублених домашніх улюбленців, пропоную переглянути невелике відео щоб зрозуміти як зі мною працювати, а вже потім пройти швидку реєстрацію. 
https://www.youtube.com/watch?v=vASw0m6YdWs`,
  WELLCOME_MENU_BUTTON_REGISTRATION: 'Зареєструватися',
  MAIN_MENU_BUTTON_REGISTRATION: 'Панель керування користувача',
  MAIN_MENU_BUTTON_REQUEST: 'Створити або закрити заявку',
  MAIN_MENU_BUTTON_SAMPLE: 'Переглянути загублених улюбленців ',

  REGISTRATION_MENU_BUTTON_CHANGE_LOCATION: 'Змінити свої координати',
  REGISTRATION_MENU_BUTTON_DEACTIVATE_USER: 'Не хочу отримувати повідомлення',
  REGISTRATION_MENU_BUTTON_ACTIVATE_USER: 'Хочу знову отримувати повідомлення',

  REGISTRATION_MESSAGE: 'Відправте Вашу локацію використовуючи функцію месенджера',
  REGISTRATION_ERROR: 'Локація була введена невірно, спробуйте зареєструватися знову',

  UPDATE_LOCATION_ERROR: 'Локація була введена невірно, спробуйте зареєструватися знову',

  YES: 'Так',
  NO: 'Ні',
  SEARCH: 'Я загубив улюбленця',
  FOUND: 'Я знайшов/бачив чийогось улюбленця',

  REGISTRATION_ENTER: 'Ваш запит на реєстрацію прийнято',

  UPDATE_LOCATION_ENTER: 'Ваш запит на зміну локації прийнято',

  APPLY_MENU_CREATE_REQUEST: 'Створити заявку',
  APPLY_MENU_DELETE: 'Закрити власну заявку',

  DEACTIVATE_USER_QUESTION: 'Ви впевнені що не бажаєте більше отримувати повідомлення про пошук?',
  DEACTIVATE_USER_TRUE: 'Ваш запит на відписку від повідомлень прийнято',
  DEACTIVATE_USER_FALSE: 'Відміна',

  ACTIVATE_USER_QUESTION: 'Ви впевнені що бажаєте знову отримувати повідомлення про пошук?',
  ACTIVATE_USER_TRUE: 'Ваш запит на отримання повідомлень прийнято',
  ACTIVATE_USER_FALSE: 'Відміна',

  REGISTRATION_MENU_MESSAGE: 'Ви в панелі управління, виберіть один із пунктів',

  REQUEST_MENU_MESSAGE: 'Ви в меню подачі заявки, виберіть один із пунктів',

  CHANGE_LOCATION_MESSAGE: 'Введіть ваші нові координати',

  CLOSE_REQUEST_MESSAGE: 'Ви не маєте активних заявок',

  CREATE_REQUEST_PHOTO_MESSAGE: 'Завантажте фотографію улюбленця',
  CREATE_REQUEST_LOCATION_MESSAGE: 'Відправте локацію де улюбленець загубився/знайшовся',
  CREATE_REQUEST_DESCRIPTION_MESSAGE: 'Введіть невеликий опис одним повідомленням',
  CREATE_REQUEST_ERROR: 'Помилка введення, спробуйте знову',
  CREATE_REQUEST_ENTER: 'Ваша заявка відправлена на модерацію',
  CREATE_REQUEST_CHOICE_TYPE: 'Виберіть один із пунктів',
  CREATE_REQUEST_NO_USER_NAME:
    'Для того щоб відправити заявку, у вашому профілі має бути вказаний Username. Створіть власний Username та спробуйте відправити заявку знову',
  CREATE_REQUEST_MANY_BAD_REQUESTS: 'Перевищено ліміт непідтверджених заявок',

  FIND_PET_PHOTO_MESSAGE: 'Завантажте фотографію знайденого улюбленця',
  FIND_PET_LOCATION_MESSAGE: 'Завантажте місце (локацію) де улюбленець був знайдений',
  FIND_PET_DESCRIPTION_MESSAGE: 'Введіть невеликий опис улюбленця одним повідомленням',

  GET_INFO_RADIUS_MESSAGE:
    'В якому радіусі ви хочете отримати вибірку заявок (значення в метрах)? Приклади: 2000, 1200, 3500',
  GET_INFO_DAYS_MESSAGE:
    'На скільки старі заявки ви бажаєте отримати? (введіть кількість днів до 30-ти) Приклади: 5, 12, 25',
  GET_INFO_ERROR: 'Помилка введення, спробуйте знову',
  GET_INFO_NO_REQUESTS: 'Заявок для показу не знайдено',

  REQUEST_TYPE_FOUND: 'found',
  REQUEST_TYPE_SEARCH: 'search',
  REQUEST_CLOSE: 'Закрити заявку',
  CLOSE_OWN_REQUEST_END: 'Вибірка завершена',
};
