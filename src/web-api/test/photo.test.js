const request = require('supertest');

const server = require('../index.js');
const { WEB_API_V1_PREFIX } = require('../../config');

jest.mock('../../services');
const { getFileLink } = require('../../services');

const route = `${WEB_API_V1_PREFIX}/photo`;

afterAll(async () => {
  await server.close();
});

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
    test(`should response with status 404 on GET ${route}/aaa`, async () => {
      const response = await request(server).get(`${route}/aaa`);
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
      getFileLink.mockReturnValue(Promise.resolve('https://picsum.photos/300'));

      const response = await request(server).get(`${route}/1`);
      expect(response.status).toEqual(200);
      expect(response.type).toContain('image/');
      expect(response.body).toBeTruthy();
    });
  });
});
