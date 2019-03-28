const { get } = require('https');
const { getFileLink, sendPhotoStream: send } = require('../services');

function getResponse(url) {
  return new Promise((resolve, reject) => {
    get(url, res => resolve(res)).on('error', error => reject(error));
  });
}

async function getPhotoStream(photoId) {
  const photoURL = await getFileLink(photoId);
  return getResponse(photoURL);
}

async function sendPhotoStream(readStream) {
  return send(readStream);
}

module.exports = {
  getPhotoStream,
  sendPhotoStream,
};
