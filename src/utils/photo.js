const { get } = require('https');
const { getFileLink } = require('../services');

function getResponse(url) {
  return new Promise((resolve, reject) => {
    get(url, res => resolve(res)).on('error', error => reject(error));
  });
}

async function getPhoto(photoId) {
  const photoURL = await getFileLink(photoId);
  return getResponse(photoURL);
}

async function sendPhotoStream(readStream) {
  const id = 'some id'; // TODO: send real id
  return id;
}

module.exports = {
  getPhoto,
  sendPhotoStream,
};
