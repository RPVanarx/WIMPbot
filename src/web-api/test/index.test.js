const request = require('supertest');
const server = require('../index.js');

afterEach(() => {
  server.close();
});

describe('Main server tests', () => {
  test('200 on GET /', async () => {
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toBeTruthy();
  });
  test('404 on GET /123abc', async () => {
    const response = await request(server).get('/123abc');
    expect(response.status).toEqual(404);
    expect(response.text).toBeTruthy();
  });
});
