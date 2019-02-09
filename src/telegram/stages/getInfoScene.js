const WizardScene = require('telegraf/scenes/wizard');

const {
    GET_INFO_SCENE_RADIUS_MESSAGE,
    EVENT_SCENE_GET_INFO,
    GET_INFO_SCENE_DAYS_MESSAGE,
    GET_INFO_SCENE_ERROR,
    PLATFORM_TYPE_TELEGRAM,
    GET_INFO_SCENE_NO_REQUESTS,
} = require('../../config');

const { mainMenu } = require('../menu');

const name = EVENT_SCENE_GET_INFO;
const { getRequests } = require('../../services');

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(GET_INFO_SCENE_RADIUS_MESSAGE);
        ctx.session.userMessage = {};
        return ctx.wizard.next();
    },
    (ctx) => {
        if (!ctx.message
            || !ctx.message.text
            || Number.isNaN(Number.parseInt(ctx.message.text, 10))) {
            ctx.reply(GET_INFO_SCENE_ERROR, mainMenu);
            delete ctx.session.userMessage;
            return ctx.scene.leave();
        }
        ctx.session.userMessage.newRadius = Number.parseInt(ctx.update.message.text, 10);
        ctx.reply(GET_INFO_SCENE_DAYS_MESSAGE);
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message
            || !ctx.message.text
            || Number.isNaN(Number.parseInt(ctx.message.text, 10))) {
            ctx.reply(GET_INFO_SCENE_ERROR, mainMenu);
            delete ctx.session.userMessage;
            return ctx.scene.leave();
        }
        try {
            const requests = await getRequests(
                ctx.message.from.id,
                PLATFORM_TYPE_TELEGRAM,
                ctx.session.userMessage.newRadius,
                Number.parseInt(ctx.message.text, 10),
            );
            if (requests.length === 0) {
                ctx.reply(GET_INFO_SCENE_NO_REQUESTS, mainMenu);
                return ctx.scene.leave();
            }

            requests.forEach((req) => {
                const messageToSend = `Тип заявки: ${req.request_type === 'search' ? 'пошук' : 'знайшли'}
Меседжер: ${req.platform_type === 'telegram' ? 'телеграм' : 'вайбер'}
Відправник: ${req.platform_type === 'telegram' ? '@' : ''}${req.user_name}
Дата заявки: ${req.creation_date.toLocaleString()}
Повідомлення від користувача: ${req.message}`;
                ctx.replyWithPhoto(req.photo, { reply_markup: { inline_keyboard: [[{ text: 'дати коментар', callback_data: 'deleteRequest' }]] }, caption: messageToSend });
            });
        } catch (error) {
            ctx.reply(GET_INFO_SCENE_ERROR, mainMenu);
            console.log(`getInfoScene ${error}`);
        }
        ctx.reply('Вибірка завершена', mainMenu);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
