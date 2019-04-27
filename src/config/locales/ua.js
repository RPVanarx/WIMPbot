module.exports = {
  WELCOME_MESSAGE: `Привіт, Ви приєдналися до чат-боту з пошуку загублених домашніх улюбленців, пропоную переглянути невелике відео щоб зрозуміти як зі мною працювати, а вже потім пройти швидку реєстрацію. 
https://www.youtube.com/watch?v=vASw0m6YdWs`,
  WELCOME_MENU_BUTTON_REGISTRATION: 'Зареєструватися',

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
    QUESTION_LOCATION: 'За якими координатами ви бажаєте зробити вибірку?',
  },

  CLOSE_OWN_REQUESTS_MESSAGES: {
    NO_REQUESTS: 'Ви не маєте активних заявок',
    CLOSE: 'Закрити заявку',
    SAMPLE_END: 'Вибірка власних заявок завершена',
  },

  SERVICES_MESSAGES: {
    MODERATION_FALSE: 'Ваша заявка не пройшла модерацію і була відхилена',
    MODERATION_TRUE: 'Ваша заявка пройшла модерацію і була опублінована в системі',
  },

  CREATE_MESSAGE_TEXTS: {
    TYPE: 'Тип заявки:',
    ANSWER_SEARCH: 'пошук',
    ANSWER_FOUND: 'знайшли',
    PLATFORM: 'Месенджер:',
    SENDER: 'Відправник:',
    DATE: 'Час створення:',
    LOCATION: 'Координати заявки:',
    MESSAGE_FROM_USER: 'Опис від користувача:',
    LOCATION_LINE_BEGIN: '<a href="http://maps.google.com/maps?q=',
    URL: 'http://maps.google.com/maps?q=',
    LOCATION_LINE_END: '">тут</a>',
    REQUEST: 'Заявка №',
    TELEGRAM_URL: 'https://t.me/',
  },

  MODER_BUTTON: {
    APPROVE: 'підтвердити',
    DECLINE: 'відмовити',
  },

  YOU: 'Ви',

  VIBER_REQUEST_CLOSE: {
    REQUEST: 'Заявка',
    CLOSE: 'закрита',
  },

  VIBER_TELEPHONE: {
    NUMBER:
      'Для створення заявки необхідно надати свій номер мобільного, інакше інші користувачі не зможуть вам відповісти',
    SHARE_NUMBER: 'Відправити свій номер телефону',
  },

  VIBER_BACK_MAIN_MENU: 'Ви повернулися в головне меню',

  VIBER_BAD_REQUEST: 'Щось пішло не так, ви повернуті до головного меню',

  VIBER_KEYBOARD: {
    BACK_MAIN_MENU: 'Повернутися в головне меню',
    CLOSE_REQUEST: 'Закрити заявку',
  },
};
