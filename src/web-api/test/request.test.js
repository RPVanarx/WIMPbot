const request = require('supertest');
const { koaApp } = require('../index.js');
const webToken = require('../utils/web-token');
const { WEB_API_V1_PREFIX, WEB_API_PATH_REQUEST } = require('../../config');

const server = koaApp.callback();
const route = `${WEB_API_V1_PREFIX}${WEB_API_PATH_REQUEST}`;

jest.mock('../../utils/photo');
const { sendPhotoStream } = require('../../utils/photo');

describe(`${WEB_API_PATH_REQUEST} route test`, () => {
  let fakeToken = null;
  beforeAll(() => {
    fakeToken = webToken.put({ id: 0, name: 'dummy' });
  });
  describe('Response test', () => {
    test(`should response with status 200 and proper JSON on valid request`, async () => {
      sendPhotoStream.mockImplementationOnce(async readStream => {
        readStream.resume();
        return Promise.resolve('1');
      });
      const response = await request(server)
        .post(route)
        .set('Cookie', [`token=${fakeToken}`])
        .field({ lon: 10 })
        .field({ lat: 10 })
        .field({ msg: 'cat' })
        .attach('photo', `${__dirname}/test.png`);
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('request');
      expect(json.request).toBeTruthy();
    });
  });
  describe('Error test', () => {
    test(`should response with status 405 on GET ${route}`, async () => {
      const response = await request(server).get(route);
      expect(response.status).toEqual(405);
    });
    test(`should response with 401 on no token in cookies`, async () => {
      const response = await request(server).post(route);
      expect(response.status).toEqual(401);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test(`should response with 400 on empty POST`, async () => {
      const response = await request(server)
        .post(route)
        .set('Cookie', [`token=${fakeToken}`]);
      expect(response.status).toEqual(400);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test(`should response with 400 on invalid fields in POST`, async () => {
      const response = await request(server)
        .post(route)
        .field({ photo: 'Manny' })
        .field({ msg: 'cat' })
        .set('Cookie', [`token=${fakeToken}`]);
      expect(response.status).toEqual(400);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test(`should response with 400 on no file in POST`, async () => {
      const response = await request(server)
        .post(route)
        .field({ lon: 10 })
        .field({ lat: 10 })
        .field({ msg: 'cat' })
        .set('Cookie', [`token=${fakeToken}`]);
      expect(response.status).toEqual(400);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toContain('No photo provided');
    });
  });
});
