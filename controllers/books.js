const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const collection = () => getDb().collection('books');

const pickBook = (b) => ({
  title: b.title,
  authorId: new ObjectId(b.authorId),
  isbn: b.isbn,
  genre: b.genre,
  publishedYear: b.publishedYear,
  pages: b.pages,
  publisher: b.publisher,
  available: b.available === undefined ? true : b.available
});

const authorExists = async (authorId) =>
  !!(await getDb().collection('authors').findOne({ _id: authorId }, { projection: { _id: 1 } }));

const isbnTaken = async (isbn, excludeId) => {
  const query = { isbn };
  if (excludeId) query._id = { $ne: excludeId };
  return !!(await collection().findOne(query, { projection: { _id: 1 } }));
};

const getAll = async (req, res, next) => {
  try {
    const books = await collection().find().toArray();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

const getSingle = async (req, res, next) => {
  try {
    const book = await collection().findOne({ _id: new ObjectId(req.params.id) });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const book = pickBook(req.body);
    if (!(await authorExists(book.authorId))) {
      return res.status(400).json({ error: 'authorId does not match any existing author' });
    }
    if (await isbnTaken(book.isbn)) {
      return res.status(409).json({ error: 'A book with this ISBN already exists' });
    }
    const result = await collection().insertOne(book);
    res.status(201).json({ id: result.insertedId, ...book });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const book = pickBook(req.body);
    if (!(await authorExists(book.authorId))) {
      return res.status(400).json({ error: 'authorId does not match any existing author' });
    }
    if (await isbnTaken(book.isbn, id)) {
      return res.status(409).json({ error: 'Another book with this ISBN already exists' });
    }
    const result = await collection().replaceOne({ _id: id }, book);
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Book not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await collection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getSingle, create, update, remove };
