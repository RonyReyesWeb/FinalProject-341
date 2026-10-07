const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const collection = () => getDb().collection('loans');

const pickLoan = (b) => ({
  bookId: new ObjectId(b.bookId),
  memberId: new ObjectId(b.memberId),
  loanDate: b.loanDate,
  dueDate: b.dueDate,
  returned: b.returned === undefined ? false : b.returned,
  notes: b.notes || ''
});

// Returns an error message if the referenced book or member doesn't exist
const checkReferences = async (loan) => {
  const db = getDb();
  const [book, member] = await Promise.all([
    db.collection('books').findOne({ _id: loan.bookId }, { projection: { _id: 1 } }),
    db.collection('members').findOne({ _id: loan.memberId }, { projection: { _id: 1 } })
  ]);
  if (!book) return 'bookId does not match any existing book';
  if (!member) return 'memberId does not match any existing member';
  return null;
};

const getAll = async (req, res, next) => {
  try {
    const loans = await collection().find().toArray();
    res.status(200).json(loans);
  } catch (err) {
    next(err);
  }
};

const getSingle = async (req, res, next) => {
  try {
    const loan = await collection().findOne({ _id: new ObjectId(req.params.id) });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.status(200).json(loan);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const loan = pickLoan(req.body);
    const refError = await checkReferences(loan);
    if (refError) return res.status(400).json({ error: refError });
    const result = await collection().insertOne(loan);
    res.status(201).json({ id: result.insertedId, ...loan });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const loan = pickLoan(req.body);
    const refError = await checkReferences(loan);
    if (refError) return res.status(400).json({ error: refError });
    const result = await collection().replaceOne({ _id: new ObjectId(req.params.id) }, loan);
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Loan not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await collection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Loan not found' });
    res.status(200).json({ message: 'Loan deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getSingle, create, update, remove };
