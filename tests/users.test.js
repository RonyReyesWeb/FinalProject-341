jest.mock('../db/connect', () => ({ getDb: jest.fn(), initDb: jest.fn() }));
// Pretend a user is logged in so we can test the protected GET routes
jest.mock('../middleware/auth', () => ({
  isAuthenticated: (req, res, next) => {
    req.user = global.__testUser;
    next();
  }
}));

const request = require('supertest');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { fakeCollection } = require('./helpers');
const app = require('../app');

const sample = {
  _id: new ObjectId(),
  githubId: '123456',
  username: 'octocat',
  displayName: 'The Octocat',
  email: 'octocat@example.com',
  role: 'member',
  loginCount: 3
};
const useCollection = (coll) => getDb.mockReturnValue({ collection: () => coll });

beforeEach(() => {
  global.__testUser = { _id: String(sample._id), username: sample.username };
});

describe('GET /users', () => {
  test('returns 200 and a list of users', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].username).toBe('octocat');
  });

  test('returns 200 and one user by id', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get(`/users/${sample._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(String(sample._id));
  });

  test('returns 404 when the user does not exist', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get(`/users/${new ObjectId()}`);
    expect(res.statusCode).toBe(404);
  });

  test('returns 400 for an invalid id', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/users/not-a-valid-id');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  test('returns 500 when the database fails', async () => {
    useCollection(fakeCollection([], { fail: true }));
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(500);
  });
});

describe('GET /users/me', () => {
  test('returns 200 and the logged-in user profile', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/users/me');
    expect(res.statusCode).toBe(200);
    expect(res.body.githubId).toBe('123456');
  });

  test('returns 404 when the logged-in user is not in the database', async () => {
    global.__testUser = { _id: String(new ObjectId()) };
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/users/me');
    expect(res.statusCode).toBe(404);
  });
});
