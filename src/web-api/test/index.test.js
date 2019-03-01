const request = require('supertest');

const server = require('../index.js');

afterAll(async () => {
  await server.close();
});

describe('root route test', () => {
  test('should response with body and status 200 on GET /', async () => {
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toBeTruthy();
  });
  test('should response with body and status 200 on GET /api', async () => {
    const response = await request(server).get('/api');
    expect(response.status).toEqual(200);
    expect(response.text).toBeTruthy();
  });
  test('should response with body and status 200 on GET /api/v1', async () => {
    const response = await request(server).get('/api/v1');
    expect(response.status).toEqual(200);
    expect(response.text).toBeTruthy();
  });
  test('should response with body and status 404 on GET /123/abc', async () => {
    const response = await request(server).get('/123/abc');
    expect(response.status).toEqual(404);
    expect(response.text).toBeTruthy();
  });
});
