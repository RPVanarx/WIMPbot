const KeyboardMessage = require('viber-bot').Message.Keyboard;
const keyboard = require('./menu');
const { PLATFORM_TYPE_VIBER } = require('../config');
const { getUserStep, getUserActivity, getUserRequests } = require('../services');

module.exports = async id => {
  const step = await getUserStep({
    platformId: id,
    platformType: PLATFORM_TYPE_VIBER,
  });
  let buttons;
  switch (step) {
    case 1: {
      buttons = new KeyboardMessage(keyboard.mainMenu);
      break;
    }
    case 2: {
      buttons = new KeyboardMessage(
        keyboard.controlPanel(
          await getUserActivity({
            platformId: id,
            platformType: PLATFORM_TYPE_VIBER,
          }),
        ),
      );
      break;
    }
    case 3: {
      buttons = new KeyboardMessage(keyboard.backMainMenu);
      break;
    }
    case 4: {
      buttons = new KeyboardMessage(keyboard.requestMenu);
      break;
    }
    case 5: {
      buttons = keyboard.phoneShare;
      break;
    }
    case 6: {
      buttons = new KeyboardMessage(keyboard.searchFoundMenu);
      break;
    }
    case 7: {
      buttons = new KeyboardMessage(keyboard.backMainMenu);
      break;
    }
    case 8: {
      buttons = new KeyboardMessage(keyboard.backMainMenu);
      break;
    }
    case 9: {
      buttons = new KeyboardMessage(keyboard.backMainMenu);
      break;
    }
    case 10: {
      const requests = await getUserRequests({
        platformId: id,
        platformType: PLATFORM_TYPE_VIBER,
      });
      buttons = keyboard.deleteRequestButtons(requests);
      break;
    }
    case 11: {
      const requests = await getUserRequests({
        platformId: id,
        platformType: PLATFORM_TYPE_VIBER,
      });
      buttons = keyboard.deleteRequestButtons(requests);
      break;
    }
    case 12: {
      buttons = new KeyboardMessage(keyboard.locationChoise);
      break;
    }
    case 13: {
      buttons = new KeyboardMessage(keyboard.backMainMenu);
      break;
    }
    case 14: {
      buttons = new KeyboardMessage(keyboard.backMainMenu);
      break;
    }
    default: {
      buttons = new KeyboardMessage(keyboard.mainMenu);
      console.log('default');
    }
  }
  return buttons;
};
