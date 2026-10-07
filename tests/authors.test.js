jest.mock('../db/connect', () => ({ getDb: jest.fn(), initDb: jest.fn() }));

const request = require('supertest');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { fakeCollection } = require('./helpers');
const app = require('../app');

const sample = { _id: new ObjectId(), firstName: 'Brandon', lastName: 'Sanderson', birthDate: '1975-12-19', nationality: 'American' };
const useCollection = (coll) => getDb.mockReturnValue({ collection: () => coll });

describe('GET /authors', () => {
  test('returns 200 and a list of authors', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/authors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].firstName).toBe(sample.firstName);
  });

  test('returns 200 and one author by id', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get(`/authors/${sample._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(String(sample._id));
  });

  test('returns 404 when the author does not exist', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get(`/authors/${new ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for an invalid id', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/authors/not-a-valid-id');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  test('returns 500 when the database fails', async () => {
    useCollection(fakeCollection([], { fail: true }));
    const res = await request(app).get('/authors');
    expect(res.statusCode).toBe(500);
  });
});
