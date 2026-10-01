const { MongoClient } = require('mongodb');

let database;

const initDb = async () => {
  if (database) return database;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  database = client.db(process.env.DB_NAME || 'library');
  console.log('Connected to MongoDB');
  return database;
};

const getDb = () => {
  if (!database) throw new Error('Database not initialized');
  return database;
};

module.exports = { initDb, getDb };
