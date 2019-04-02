const request = require('supertest');
const { koaApp } = require('../index.js');

const { WEB_API_V1_PREFIX } = require('../../config');

const route = WEB_API_V1_PREFIX;
const server = koaApp.callback();

describe(`${route} route test`, () => {
  describe(`Success on GET ${route}:`, () => {
    let response = null;
    beforeAll(async () => {
      response = await request(server).get(route);
    });
    test(`should response with status 200`, async () => {
      expect(response.status).toEqual(200);
    });
    test(`should response with proper JSON on GET ${route}`, async () => {
      expect(response.headers['content-type']).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json.name).toBeTruthy();
      expect(json.version).toBeTruthy();
      expect(json.git).toBeTruthy();
    });
  });
});
