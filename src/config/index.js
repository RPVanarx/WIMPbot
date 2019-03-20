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

  DEFAULT_VALUES: {
    RADIUS: 1000,
    DAYS_MIN: 1,
    DAYS_MAX: 30,
    RADIUS_MIN: 50,
    RADIUS_MAX: 10000,
  },

  PLATFORM_TYPE_TELEGRAM: 'telegram',

  EVENT_NAMES: {
    REGISTRATION_MENU: 'registrationMenu',
    REQUEST_MENU: 'requestMenu',
    FIND_REQUESTS: 'findRequests',
    REGISTRATION_USER: 'registrateUser',
    UPDATE_LOCATION: 'updateLocation',
    DEACTIVATE_USER: 'deactivateUser',
    CREATE_REQUEST: 'createRequest',
    DELETE_REQUEST: 'closeOwnRequest',
    ACTIVATE_USER: 'activateUser',
  },

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
    DEACTIVATE_USER: 'Не хочу отримувати заявки на пошук',
    ACTIVATE_USER: 'Хочу знову отримувати заявки на пошук',
  },

  REGISTRATION_MESSAGES: {
    CREATE:
      'Включіть GPS на Вашому телефоні та відправте свої координати, використовуючи функцію телеграма - Location',
    ERROR: 'Локація була введена невірно, спробуйте зареєструватися знову',
    ENTER: 'Вітаю! Тепер Ви зареєстрований користувач WIMP!',
  },

  BUTTON_MESSAGES: {
    SEARCH: 'Я загубив улюбленця',
    FOUND: 'Я знайшов/бачив чийогось улюбленця',
    YES: 'Так',
    NO: 'Ні',
  },

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
    UPDATE: 'Введіть ваші нові координати (не забудьте увімкнути GPS на телефоні)',
    ENTER: 'Ваш запит на зміну локації прийнято',
    ERROR: 'Локація була введена невірно, спробуйте змінити координати знову',
  },

  CREATE_REQUEST_MESSAGES: {
    PHOTO: 'Завантажте 1 фотографію улюбленця',
    LOCATION: 'Включіть GPS та відправте локацію де улюбленець загубився/знайшовся',
    DESCRIPTION: 'Введіть невеликий опис улюбленця одним повідомленням',
    ERROR: 'Помилка введення, спробуйте знову',
    ENTER: 'Ваша заявка відправлена на модерацію',
    CHOICE_TYPE: 'Виберіть один із пунктів',
    NO_USER_NAME:
      'Для того щоб відправити заявку, у вашому телеграм-профілі має бути вказаний Username. Створіть власний Username та спробуйте відправити заявку знову',
    MANY_BAD_REQUESTS: 'Перевищено ліміт непідтверджених заявок',
  },

  FIND_REQUESTS_MESSAGES: {
    RADIUS:
      'В якому радіусі від зареєстрованих координат ви бажаєте отримати вибірку заявок? Напишіть одне значення в метрах від 50 до 10000 (приклад: 2150 1233 3548)',
    DAYS:
      'На скільки старі заявки ви бажаєте побачити? Напишіть одне значення кількості днів від 1 до 30(приклади: 3, 12, 27)',
    ERROR: 'Помилка введення, спробуйте знову',
    ERROR_DAYS: 'Кількість днів має бути в межах від 1 до 30',
    ERROR_RADIUS: 'Кількість метрів має бути в межах від 50 до 10000',
    NO_REQUESTS: 'Заявок для показу не знайдено',
    SAMPLE_END: 'Вибірка заявок завершена',
    TIMEOUT: 2000,
  },

  CLOSE_OWN_REQUESTS_MESSAGES: {
    NO_REQUESTS: 'Ви не маєте активних заявок',
    CLOSE: 'Закрити заявку',
    SAMPLE_END: 'Вибірка власних заявок завершена',
    TIMEOUT: 2000,
  },

  SERVICES_MESSAGES: {
    MODERATION_FALSE: 'Ваша заявка не пройшла модерацію і була відхилена',
    MODERATION_TRUE: 'Ваша заявка пройшла модерацію і була опублінована в системі',
  },

  BUTTON_EVENT: {
    YES: 'yes',
    NO: 'no',
    SEARCH: 'search',
    FOUND: 'found',
  },

  CREATE_MESSAGE_TEXTS: {
    TYPE: 'Тип заявки:',
    ANSWER_SEARCH: 'пошук',
    ANSWER_FOUND: 'знайшли',
    PLATFORM: 'Месенджер:',
    PLATFORM_TELEGRAM: 'telegram',
    PLATFORM_VIBER: 'viber',
    SENDER: 'Відправник:',
    DATE: 'Час створення:',
    MESSAGE_FROM_USER: 'Опис від користувача:',
  },

  MODER_BUTTON: {
    APPROVE: 'підтвердити',
    DECLINE: 'відмовити',
    CB_MODERATE: 'moderate:',
    CB_TRUE: ':true',
    CB_FALSE: ':false',
  },
};
