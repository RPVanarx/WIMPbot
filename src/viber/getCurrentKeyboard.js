const KeyboardMessage = require('viber-bot').Message.Keyboard;
const { getUserStep, getUserActivity, getUserRequests } = require('../services/requestDB');
const keyboard = require('./menu');
const { PLATFORM_TYPE_VIBER } = require('../config');

module.exports = async id => {
  const step = await getUserStep({
    platformId: id,
    platformType: PLATFORM_TYPE_VIBER,
  });
  switch (step) {
    case 1: {
      return new KeyboardMessage(keyboard.mainMenu);
    }
    case 2: {
      return new KeyboardMessage(
        keyboard.controlPanel(
          await getUserActivity({
            platformId: id,
            platformType: PLATFORM_TYPE_VIBER,
          }),
        ),
      );
    }
    case (3, 7, 8, 9, 12, 13, 14): {
      return new KeyboardMessage(keyboard.backMainMenu);
    }
    case 4: {
      return new KeyboardMessage(keyboard.requestMenu);
    }
    case 5: {
      return keyboard.phoneShare;
    }
    case 6: {
      return new KeyboardMessage(keyboard.searchFoundMenu);
    }
    case 10: {
      const requests = await getUserRequests({
        platformId: id,
        platformType: PLATFORM_TYPE_VIBER,
      });
      return new KeyboardMessage(keyboard.deleteRequestButtons(requests));
    }
    case 11: {
      return new KeyboardMessage(keyboard.locationChoise);
    }
    default: {
      return new KeyboardMessage(keyboard.mainMenu);
    }
  }
};
