const request = require('supertest');

const { koaApp } = require('../index.js');

const {
  PREFIX: { API_V1, SIGNIN },
} = require('../../config/webApi');

const server = koaApp.callback();
const route = `${API_V1}${SIGNIN}`;

jest.mock('../utils/telegram-authorization');
jest.mock('../../services/user');

const { getUserId } = require('../../services/user');
const authorize = require('../utils/telegram-authorization');

describe(`${SIGNIN} route test`, () => {
  describe('Error test', () => {
    beforeAll(() => {
      authorize.mockImplementation(() => {
        throw new Error('>:D  HA-HA!');
      });
      getUserId.mockImplementation(() => Promise.resolve('0'));
    });
    test(`should response with status 401 on invalid query`, async () => {
      const response = await request(server).get(`${route}?a=1&b=2`);
      expect(response.status).toEqual(401);
    });
    test(`should response with JSON that contains error message`, async () => {
      const response = await request(server).get(route);
      expect(response.headers['content-type']).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test(`should response with status 404 on GET ${route}/aaa`, async () => {
      const response = await request(server).get(`${route}/aaa`);
      expect(response.status).toEqual(404);
    });
    test(`should response with status 500 on services error services`, async () => {
      authorize.mockImplementation(data => data);
      getUserId.mockImplementationOnce(() => Promise.reject(Error('>:)')));
      const response = await request(server).get(`${route}`);
      expect(response.status).toEqual(500);
    });
  });

  describe('Response test', () => {
    test('should response with status 200', async () => {
      authorize.mockImplementationOnce(data => data);
      const response = await request(server).get(`${route}?id=0`);
      expect(response.status).toEqual(200);
      expect(response.headers['x-token']).toBeDefined();
      expect(response.headers['x-token-expire']).toBeDefined();
    });
  });
});
