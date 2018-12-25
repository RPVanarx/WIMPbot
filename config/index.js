require('dotenv').config();

module.exports = {
    TOKEN: process.env.TOKEN,
    db: {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    },
    REGISTRATION_MESSAGE: 'Відправте Вашу локацію ',
    REGISTRATION_ERROR: 'Локація була введена невірно, спробуйте знову',
    REGISTRATION_ENTER: 'Дякую, Ваш запит прийнято',
    DELETE_USER_QUESTION: 'Ви впевнені що бажаєте видалитися? (відправте повідомлення так чи ні)',
    DELETE_USER_TRUE: 'Ваш запит на видалення прийнято',
    DELETE_USER_FALSE: 'Відміна видалення',
    WELCOME_MESSAGE: 'Привіт, для початку роботи зі мною зареєструйтесь в системі',
    REGISTRATION_MENU_MESSAGE: 'Ви в меню реєстрації, виберіть один із пунктів',
    REQUEST_MENU_MESSAGE: 'Ви в меню подачі заявки на пошук,  виберіть один із пунктів',
    CHANGE_LOCATION_SCENE_MESSAGE: 'Введіть ваші нові GPS координати',
    DELETE_PET_SCENE_MESSAGE1: 'Введіть номер вашої заявки яку ви прагнете видалити',

};
