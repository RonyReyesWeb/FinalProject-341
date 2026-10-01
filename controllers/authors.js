const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const collection = () => getDb().collection('authors');

const pickAuthor = (b) => ({
  firstName: b.firstName,
  lastName: b.lastName,
  birthDate: b.birthDate,
  nationality: b.nationality,
  email: b.email || null
});

const getAll = async (req, res, next) => {
  try {
    const authors = await collection().find().toArray();
    res.status(200).json(authors);
  } catch (err) {
    next(err);
  }
};

const getSingle = async (req, res, next) => {
  try {
    const author = await collection().findOne({ _id: new ObjectId(req.params.id) });
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const author = pickAuthor(req.body);
    const result = await collection().insertOne(author);
    res.status(201).json({ id: result.insertedId, ...author });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const author = pickAuthor(req.body);
    const result = await collection().replaceOne({ _id: new ObjectId(req.params.id) }, author);
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Author not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const bookCount = await getDb().collection('books').countDocuments({ authorId: id });
    if (bookCount > 0) {
      return res.status(409).json({
        error: `Cannot delete author: ${bookCount} book(s) still reference this author. Delete or reassign them first.`
      });
    }
    const result = await collection().deleteOne({ _id: id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getSingle, create, update, remove };
