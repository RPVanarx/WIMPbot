const Stage = require('telegraf/stage');

const getInfoScene = require('./getInfoScene');
const registrationUserScene = require('./registrationUserScene');
const searchPetScene = require('./searchPetScene');
const changeLocationScene = require('./changeLocationScene');
const deleteUserScene = require('./deleteUserScene');
const deletePetScene = require('./deletePetScene');
const findPetScene = require('./findPetScene');

const stage = new Stage();
stage.register(
    getInfoScene.scene,
    registrationUserScene.scene,
    searchPetScene.scene,
    changeLocationScene.scene,
    deleteUserScene.scene,
    deletePetScene.scene,
    findPetScene.scene,
);

module.exports = {
    stage,
    stagesArray: [
        getInfoScene,
        registrationUserScene,
        searchPetScene,
        changeLocationScene,
        deleteUserScene,
        deletePetScene,
        findPetScene],
};
