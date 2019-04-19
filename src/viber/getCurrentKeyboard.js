const keyboard = require('./menu');
const { PLATFORM_TYPE_VIBER } = require('../config');
const { getUserStep } = require('../services');

async function getCurrentKeyboard(id) {
  const step = await getUserStep({
    platformId: id,
    platformType: PLATFORM_TYPE_VIBER,
  });
  let buttons;
  switch (step) {
    case 1: {
      buttons = keyboard.mainMenu;
      break;
    }
    case 2: {
      buttons = keyboard.phoneShare;
      break;
    }
    default: {
      console.log('default');
    }
  }
  return buttons;
}

module.exports = getCurrentKeyboard;
