const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const collection = () => getDb().collection('members');

const pickMember = (b) => ({
  firstName: b.firstName,
  lastName: b.lastName,
  email: b.email.toLowerCase(),
  phone: b.phone,
  membershipType: b.membershipType,
  joinDate: b.joinDate
});

const emailTaken = async (email, excludeId) => {
  const query = { email };
  if (excludeId) query._id = { $ne: excludeId };
  return !!(await collection().findOne(query, { projection: { _id: 1 } }));
};

const getAll = async (req, res, next) => {
  try {
    const members = await collection().find().toArray();
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};

const getSingle = async (req, res, next) => {
  try {
    const member = await collection().findOne({ _id: new ObjectId(req.params.id) });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.status(200).json(member);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const member = pickMember(req.body);
    if (await emailTaken(member.email)) {
      return res.status(409).json({ error: 'A member with this email already exists' });
    }
    const result = await collection().insertOne(member);
    res.status(201).json({ id: result.insertedId, ...member });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const member = pickMember(req.body);
    if (await emailTaken(member.email, id)) {
      return res.status(409).json({ error: 'Another member already uses this email' });
    }
    const result = await collection().replaceOne({ _id: id }, member);
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Member not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const openLoans = await getDb().collection('loans').countDocuments({ memberId: id, returned: false });
    if (openLoans > 0) {
      return res.status(409).json({ error: `Cannot delete member: they still have ${openLoans} unreturned loan(s)` });
    }
    const result = await collection().deleteOne({ _id: id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Member not found' });
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getSingle, create, update, remove };
