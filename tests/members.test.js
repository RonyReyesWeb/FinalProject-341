jest.mock('../db/connect', () => ({ getDb: jest.fn(), initDb: jest.fn() }));

const request = require('supertest');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { fakeCollection } = require('./helpers');
const app = require('../app');

const sample = { _id: new ObjectId(), firstName: 'Ana', lastName: 'Lopez', email: 'ana@example.com', phone: '555-123-4567', membershipType: 'student', joinDate: '2026-09-01' };
const useCollection = (coll) => getDb.mockReturnValue({ collection: () => coll });

describe('GET /members', () => {
  test('returns 200 and a list of members', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/members');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].email).toBe(sample.email);
  });

  test('returns 200 and one member by id', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get(`/members/${sample._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(String(sample._id));
  });

  test('returns 404 when the member does not exist', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get(`/members/${new ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for an invalid id', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/members/not-a-valid-id');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  test('returns 500 when the database fails', async () => {
    useCollection(fakeCollection([], { fail: true }));
    const res = await request(app).get('/members');
    expect(res.statusCode).toBe(500);
  });
});
