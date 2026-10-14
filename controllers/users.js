const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const collection = () => getDb().collection('users');

// Called by passport after a successful GitHub login: creates the user the
// first time, and updates their profile + login stats on every later login.
const upsertFromGithub = async (profile) => {
  const now = new Date();
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

  const result = await collection().findOneAndUpdate(
    { githubId: String(profile.id) },
    {
      $set: {
        username: profile.username,
        displayName: profile.displayName || profile.username,
        email,
        avatarUrl,
        profileUrl: profile.profileUrl || null,
        lastLogin: now
      },
      $setOnInsert: { githubId: String(profile.id), role: 'member', createdAt: now },
      $inc: { loginCount: 1 }
    },
    { upsert: true, returnDocument: 'after' }
  );
  // mongodb driver v6 returns the document; older versions wrap it in { value }
  return result && result.lastErrorObject ? result.value : result;
};

const getAll = async (req, res, next) => {
  try {
    const users = await collection().find().toArray();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getSingle = async (req, res, next) => {
  try {
    const user = await collection().findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// The profile of whoever is logged in right now
const getMe = async (req, res, next) => {
  try {
    if (!req.user || !ObjectId.isValid(req.user._id)) {
      return res.status(404).json({ error: 'User profile not found. Log out and log in again.' });
    }
    const user = await collection().findOne({ _id: new ObjectId(req.user._id) });
    if (!user) return res.status(404).json({ error: 'User profile not found. Log out and log in again.' });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await collection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { upsertFromGithub, getAll, getSingle, getMe, remove };
