const request = require('supertest');

const { koaApp } = require('../index.js');

const {
  PREFIX: { API_V1, SIGNUP },
} = require('../../config/webApi');
const webToken = require('../utils/web-token');

const server = koaApp.callback();
const route = `${API_V1}${SIGNUP}`;

describe(`${SIGNUP} route test`, () => {
  let fakeToken;
  let validFakeRequest;
  beforeAll(() => {
    fakeToken = webToken.put({ id: '0', name: 'dummy' });
    validFakeRequest = `${route}?lon=2&lat=3`;
  });

  describe('JSON test', () => {
    test(`should response with status 200 and proper JSON on valid request`, async () => {
      const response = await request(server)
        .get(validFakeRequest)
        .set('x-token', [`${fakeToken}`]);
      expect(response.status).toEqual(200);
      expect(response.headers['content-type']).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('registered');
      expect(json.registered).toBeTruthy();
    });
  });

  describe('Error test', () => {
    test(`should response with status 400 on empty query GET ${route}`, async () => {
      const response = await request(server)
        .get(route)
        .set('x-token', [`${fakeToken}`]);
      expect(response.status).toEqual(400);
    });
    test(`should response with JSON that contains error message`, async () => {
      const response = await request(server).get(route);
      expect(response.headers['content-type']).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test(`should response with status 400 on invalid query`, async () => {
      const response = await request(server)
        .get(`${route}?a=1&b=2`)
        .set('x-token', [`${fakeToken}`]);
      expect(response.status).toEqual(400);
    });
    test(`should response with status 401 on invalid token`, async () => {
      const response = await request(server).get(`${route}?r=1000&token=123456789&lon=10&lat=10`);
      expect(response.status).toEqual(401);
    });
    test(`should response with status 404 on GET ${route}/aaa`, async () => {
      const response = await request(server).get(`${route}/aaa`);
      expect(response.status).toEqual(404);
    });
  });
});
