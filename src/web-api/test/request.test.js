const request = require('supertest');
const { koaApp } = require('../index.js');
// const webToken = require('../utils/web-token');
const { WEB_API_V1_PREFIX, WEB_API_PATH_REQUEST } = require('../../config');

const server = koaApp.callback();
const route = `${WEB_API_V1_PREFIX}${WEB_API_PATH_REQUEST}`;

describe(`${WEB_API_PATH_REQUEST} route test`, () => {
  // describe('Response test', () => {
  //   const fakeToken = webToken.create('0');
  //   const validFakeRequest = `${route}?lon=2&lat=3&token=${fakeToken}`;
  //   test(`should response with status 200 and proper JSON on valid request`, async () => {
  //     const response = await request(server).get(validFakeRequest);
  //     console.log(response);
  //     expect(response.status).toEqual(200);
  //     expect(response.headers['content-type']).toContain('application/json');

  //     const json = JSON.parse(response.text);
  //     expect(json).toHaveProperty('token');
  //     expect(json).toHaveProperty('registered');
  //     expect(json.token).toEqual(fakeToken);
  //     expect(json.registered).toBeTruthy();
  //   });
  // });
  describe('Error test', () => {
    test(`should response with status 405 on GET ${route}`, async () => {
      const response = await request(server).get(route);
      expect(response.status).toEqual(405);
    });
    test(`should response with 400 on empty POST`, async () => {
      const response = await request(server).post(route);
      expect(response.status).toEqual(400);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test(`should response with 400 on invelid fields in POST`, async () => {
      const response = await request(server)
        .post(route)
        .send({ photo: 'Manny', msg: 'cat' });
      expect(response.status).toEqual(400);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test(`should response with 400 on no file in POST`, async () => {
      const response = await request(server)
        .post(route)
        .send({
          lon: 10,
          lat: 10,
          token: '1234567890123456789012345678901234567890123456789012345678901234',
          msg: 'cat',
        });
      expect(response.status).toEqual(400);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test(`should response with 400 on no file in POST`, async () => {
      const response = await request(server)
        .post(route)
        .send({
          lon: 10,
          lat: 10,
          token: '1234567890123456789012345678901234567890123456789012345678901234',
          msg: 'cat',
        });
      expect(response.status).toEqual(400);
      expect(response.type).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
  });
});
