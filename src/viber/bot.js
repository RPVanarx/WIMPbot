const ViberBot = require('viber-bot').Bot;
const {
  credentials: { VIBER_TOKEN },
  viberEvents: { BOT_NAME, AVATAR_URL },
} = require('../config');

const bot = new ViberBot({
  authToken: VIBER_TOKEN,
  name: BOT_NAME,
  avatar: AVATAR_URL,
});

module.exports = bot;
