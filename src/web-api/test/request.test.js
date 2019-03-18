const request = require('supertest');

const server = require('../index.js');
const { WEB_API_V1_PREFIX, WEB_API_PATH_REQUEST } = require('../../config');

// jest.mock('../../services');
// const { getFileLink } = require('../../services');

const route = WEB_API_V1_PREFIX + WEB_API_PATH_REQUEST;

afterAll(async () => {
  await server.close();
});

describe(`${WEB_API_PATH_REQUEST} route test`, () => {
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
