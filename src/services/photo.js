const { get } = require('https');

const { sendPhotoStream, getFileLink, getNewPhotoId } = require('../telegram/addFunctions');

async function getPhotoStream(photoId) {
  const photoURL = await getFileLink(photoId);

  return new Promise((resolve, reject) => {
    get(photoURL, res => resolve(res)).on('error', error => reject(error));
  });
}

module.exports = {
  getPhotoStream,
  sendPhotoStream,
  getFileLink,
  getNewPhotoId,
};
