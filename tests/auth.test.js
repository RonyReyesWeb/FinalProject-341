jest.mock('../db/connect', () => ({ getDb: jest.fn(), initDb: jest.fn() }));

const request = require('supertest');
const app = require('../app');

// No mocked login here: these tests check what a logged-out visitor gets
describe('Authentication (logged out)', () => {
  test('GET /auth/status returns 200 and loggedIn: false', async () => {
    const res = await request(app).get('/auth/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.loggedIn).toBe(false);
  });

  test('GET / returns 200 with a login link', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('/login');
  });

  test('GET /users returns 401 when not logged in', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
  });

  test('GET /users/me returns 401 when not logged in', async () => {
    const res = await request(app).get('/users/me');
    expect(res.statusCode).toBe(401);
  });

  test('POST /authors returns 401 when not logged in', async () => {
    const res = await request(app).post('/authors').send({ firstName: 'Test' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /unknown-route returns 404', async () => {
    const res = await request(app).get('/this-route-does-not-exist');
    expect(res.statusCode).toBe(404);
  });
});
