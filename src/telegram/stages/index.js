const Stage = require('telegraf/stage');

const getInfoScene = require('./findRequestsInRadius');
const registrationUserScene = require('./registrateUser');
const createRequestScene = require('./createRequest');
const updateLocationScene = require('./updateLocation');
const deactivateUserScene = require('./deactivateUser');
const deletePetScene = require('./closeOwnRequest');
const activateUserScene = require('./activateUser');

const stage = new Stage();
stage.register(
  activateUserScene.scene,
  getInfoScene.scene,
  registrationUserScene.scene,
  createRequestScene.scene,
  updateLocationScene.scene,
  deactivateUserScene.scene,
  deletePetScene.scene,
);

module.exports = {
  stage,
  stagesArray: [
    activateUserScene,
    getInfoScene,
    registrationUserScene,
    createRequestScene,
    updateLocationScene,
    deactivateUserScene,
    deletePetScene,
  ],
};
