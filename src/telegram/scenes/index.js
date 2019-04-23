const Stage = require('telegraf/stage');

const findRequests = require('./findRequests');
const registrateUser = require('./registrateUser');
const createRequest = require('./createRequest');
const updateLocation = require('./updateLocation');
const deactivateUser = require('./deactivateUser');
const closeOwnRequest = require('./closeOwnRequest');
const activateUser = require('./activateUser');

const stage = new Stage();
stage.register(
  registrateUser.scene,
  findRequests.scene,
  activateUser.scene,
  createRequest.scene,
  updateLocation.scene,
  deactivateUser.scene,
  closeOwnRequest.scene,
);

module.exports = {
  stage,
  stagesArray: [
    findRequests,
    registrateUser,
    createRequest,
    updateLocation,
    deactivateUser,
    closeOwnRequest,
    activateUser,
  ],
};
