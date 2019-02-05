const Stage = require('telegraf/stage');

const getInfoScene = require('./getInfoScene');
const registrationUserScene = require('./registrationUserScene');
const createRequestScene = require('./createRequestScene');
const updateLocationScene = require('./updateLocationScene');
const deactivateUserScene = require('./deactivateUserScene');
const deletePetScene = require('./deletePetScene');
const activateUserScene = require('./activateUserScene');

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
