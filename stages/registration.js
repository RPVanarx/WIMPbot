const WizardScene = require('telegraf/scenes/wizard');
const registration = require('../menu/registration');

const name = 'registration';

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply('Виберіть один із пунктів', registration);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
