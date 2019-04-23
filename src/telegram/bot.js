const Telegraf = require('telegraf');
const {
  credentials: { TELEGRAM_TOKEN },
} = require('../config');

const bot = new Telegraf(TELEGRAM_TOKEN);
module.exports = bot;
