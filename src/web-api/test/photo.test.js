const fs = require('fs');

const request = require('supertest');

const { koaApp } = require('../index.js');

const {
  PREFIX: { API_V1, PHOTO },
} = require('../../config/webApi');

const server = koaApp.callback();
const route = `${API_V1}${PHOTO}`;

jest.mock('../../services/photo');
const { getPhotoStream } = require('../../services/photo');

describe('/photo route test', () => {
  describe('Error test', () => {
    test(`should response with status 415 on GET ${route}/1 and 'Accept' != 'image/*'`, async () => {
      const response = await request(server)
        .get(`${route}/1`)
        .set('Accept', 'text/html');
      expect(response.status).toEqual(415);
    });
    test(`should response with status 404 on GET ${route}`, async () => {
      const response = await request(server).get(route);
      expect(response.status).toEqual(404);
    });
    test(`should response with status 404 on GET ${route}/fake-photo.jpg`, async () => {
      const err = new Error('404: Not found');
      err.code = 400;
      getPhotoStream.mockRejectedValueOnce(err);
      const response = await request(server).get(`${route}/fake-photo.jpg`);
      expect(getPhotoStream).toHaveBeenCalledTimes(1);
      expect(response.status).toEqual(404);
    });
    test(`should response with JSON that contains error message`, async () => {
      const response = await request(server).get(route);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
  });

  describe('Image test', () => {
    test(`should response with image`, async () => {
      getPhotoStream.mockResolvedValueOnce(fs.createReadStream(`${__dirname}/test.png`));

      const response = await request(server).get(`${route}/1`);
      expect(response.status).toEqual(200);
      expect(response.type).toContain('image/');
      expect(response.body).toBeTruthy();
    });
  });
});
