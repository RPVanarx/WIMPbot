const ViberBot = require('viber-bot').Bot;
const { VIBER_TOKEN } = require('../config');

const bot = new ViberBot({
  authToken: VIBER_TOKEN,
  name: 'WIMPbot',
  avatar:
    'https://dl-media.viber.com/1/share/2/long/vibes/icon/image/0x0/1433/673465886be1a0cabc915dad06fa14f71b6f80496ca0943dea5b85a4f54a1433.jpg',
});

module.exports = bot;
