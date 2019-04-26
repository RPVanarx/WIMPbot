const request = require('supertest');

const { koaApp } = require('../index.js');

const server = koaApp.callback();

describe('root route test', () => {
  describe('Success:', () => {
    test('should response with JSON on GET /', async () => {
      const response = await request(server).get('/');
      expect(response.status).toEqual(200);
      expect(response.text).toBeTruthy();
      expect(response.headers['content-type']).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('usage');
      expect(json.usage).toBeTruthy();
    });
  });
  describe('Errors:', () => {
    test('should response with status 404 on GET /aaa', async () => {
      const response = await request(server).get('/aaa');
      expect(response.status).toEqual(404);
      expect(response.text).toBeTruthy();
    });
    test('should response with JSON error on GET /abc', async () => {
      const response = await request(server).get('/abc');
      expect(response.status).toEqual(404);
      expect(response.text).toBeTruthy();
      expect(response.headers['content-type']).toContain('application/json');

      const json = JSON.parse(response.text);
      expect(json).toHaveProperty('error');
      expect(json.error).toBeTruthy();
    });
    test('should response with text and status 404 on GET /qwe', async () => {
      const response = await request(server)
        .get('/qwe')
        .accept('text/html');
      expect(response.status).toEqual(404);
      expect(response.text).toBeTruthy();
    });
    test('should response with body and status 404 on GET /123/abc', async () => {
      const response = await request(server).get('/123/abc');
      expect(response.status).toEqual(404);
      expect(response.text).toBeTruthy();
    });
  });
});
