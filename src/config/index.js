require('dotenv').config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TOKEN,
  db: {
    USER: process.env.PGUSER,
    HOST: process.env.PGHOST,
    DATABASE: process.env.PGDATABASE,
    PASSWORD: process.env.PGPASSWORD,
    PORT: process.env.PGPORT,
    RETRIES: 5,
    DELAY: 3000,
  },
  MODERATOR_GROUP_ID: process.env.MODERATORSID,

  WEB_PORT: process.env.WEB_PORT || 3003,
  WEB_CORS_ORIGIN: process.env.WEB_CORS_ORIGIN || 'http://localhost:1234',

  WEB_TOKEN_KEY: process.env.WEB_TOKEN_KEY,

  WEB_AUTH_AGE: process.env.WEB_AUTH_AGE || 1000 * 60 * 60, // 60 min by default
  WEB_PHOTO_FILE_SIZE_MAX: 10 * 1024 * 1024, // 10 MiB (10 MB is telegram API limit)
  WEB_PHOTO_FILE_SIZE_MIN: 1024, // 1 KiB
  WEB_POST_FIELD_LENGTH_MAX: 1024,

  WEB_API_JSON_ERROR_NAME: 'error',

  WEB_API_V1_PREFIX: '/api/v1',
  WEB_API_PATH_PHOTO: '/photo',
  WEB_API_PATH_REQUESTS: '/requests',
  WEB_API_PATH_LIST: '/list',
  WEB_API_PATH_REQUEST: '/request',
  WEB_API_PATH_SIGNIN: '/signin',
  WEB_API_PATH_SIGNUP: '/signup',

  DEFAULT_VALUES: {
    DAYS_MIN: 1,
    DAYS_MAX: 30,
    LATITUDE_MIN: -90,
    LATITUDE_MAX: 90,
    LONGITUDE_MIN: -180,
    LONGITUDE_MAX: 180,
    RADIUS: 1000,
    RADIUS_MIN: 50,
    RADIUS_MAX: 10000,
    REQUEST_MESSAGE_MAX: 1000, // symbols (aka String.length)
  },

  PLATFORM_TYPE_WEB: 'web',
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

  FIND_REQUESTS_BUTTON: {
    USE_REG_LOCATION: 'Використати зареєстровані координати',
    USE_NEW_LOCATION: 'Ввести довільні координати',
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
    DESCRIPTION: 'Введіть невеликий опис улюбленця одним повідомленням до 1000 символів',
    ERROR: 'Помилка введення, спробуйте знову',
    ENTER: 'Ваша заявка відправлена на модерацію',
    CHOICE_TYPE: 'Виберіть один із пунктів',
    NO_USER_NAME:
      'Для того щоб відправити заявку, у вашому телеграм-профілі має бути вказаний Username. Створіть власний Username та спробуйте відправити заявку знову',
    MANY_BAD_REQUESTS: 'Перевищено ліміт непідтверджених заявок',
    MANY_LETTERS: 'Ваше повідомлення перевищує 1000 символів, скоротіть його та спробуйте ще раз',
    BLOCK_INTERVAL: 86400000,
  },

  FIND_REQUESTS_MESSAGES: {
    RADIUS:
      'В якому радіусі від зареєстрованих координат ви бажаєте отримати вибірку заявок? Напишіть одне значення в метрах від 50 до 10000',
    NEW_LOCATION_RADIUS:
      'В якому радіусі від введених координат ви бажаєте отримати вибірку заявок? Напишіть одне значення в метрах від 50 до 10000',
    DAYS:
      'На скільки старі заявки ви бажаєте побачити? Напишіть одне значення кількості днів від 1 до 30',
    LOCATION: 'Включіть ваш GPS та відправте координати для вибірки заявок',
    ERROR: 'Помилка введення, спробуйте знову',
    ERROR_DAYS: 'Кількість днів має бути в межах від 1 до 30',
    ERROR_RADIUS: 'Кількість метрів має бути в межах від 50 до 10000',
    NO_REQUESTS: 'Заявок для показу не знайдено',
    SAMPLE_END: 'Вибірка заявок завершена',
    CB_NEW_LOCATION: 'newLocation',
    CB_REGISTRATE_LOCATION: 'registrateLocation',
    QUESTION_LOCATION: 'За якими координатами ви бажаєте зробити вибірку?',
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
    LOCATION: 'Координати заявки:',
    MESSAGE_FROM_USER: 'Опис від користувача:',
    LOCATION_LINE_BEGIN: '<a href="http://maps.google.com/maps?q=',
    LOCATION_LINE_END: '">тут</a>',
  },

  MODER_BUTTON: {
    APPROVE: 'підтвердити',
    DECLINE: 'відмовити',
    CB_MODERATE: 'moderate:',
    CB_TRUE: ':true',
    CB_FALSE: ':false',
  },
};
