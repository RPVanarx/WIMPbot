const Stage = require('telegraf/stage');

const getInfoScene = require('./getInfo');
const updateDataScene = require('./updateDate');
const createRequestScene = require('./createRequest');
// const registration = require('./registration');
const changeLocation = require('./changeLocation');
const deleteUser = require('./deleteUser');

const stage = new Stage();
stage.register(
    getInfoScene.scene,
    updateDataScene.scene,
    createRequestScene.scene,
    // registration.scene,
    changeLocation.scene,
    deleteUser.scene,
);

module.exports = {
    stage,
    stagesArray: [
        getInfoScene,
        updateDataScene,
        createRequestScene,
        // registration,
        changeLocation,
        deleteUser],
};
