const Stage = require('telegraf/stage');

const getInfoScene = require('./getInfo');
const updateDataScene = require('./updateDate');
const createRequestScene = require('./createRequest');

const stage = new Stage();
stage.register(getInfoScene.scene, updateDataScene.scene, createRequestScene.scene);

module.exports = {
    stage,
    stagesArray: [getInfoScene, updateDataScene, createRequestScene],
};
