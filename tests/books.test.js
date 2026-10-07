jest.mock('../db/connect', () => ({ getDb: jest.fn(), initDb: jest.fn() }));

const request = require('supertest');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { fakeCollection } = require('./helpers');
const app = require('../app');

const sample = { _id: new ObjectId(), title: 'Mistborn', authorId: new ObjectId(), isbn: '9780765311788', genre: 'Fantasy', publishedYear: 2006, pages: 541, publisher: 'Tor', available: true };
const useCollection = (coll) => getDb.mockReturnValue({ collection: () => coll });

describe('GET /books', () => {
  test('returns 200 and a list of books', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe(sample.title);
  });

  test('returns 200 and one book by id', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get(`/books/${sample._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(String(sample._id));
  });

  test('returns 404 when the book does not exist', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get(`/books/${new ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for an invalid id', async () => {
    useCollection(fakeCollection([sample]));
    const res = await request(app).get('/books/not-a-valid-id');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  test('returns 500 when the database fails', async () => {
    useCollection(fakeCollection([], { fail: true }));
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(500);
  });
});
