const { MongoClient } = require('mongodb');
const dns = require('dns');

// Fix for "querySrv ECONNREFUSED" on some Windows networks: the router's DNS
// can't resolve the SRV record that mongodb+srv:// needs, so use public DNS.
dns.setServers(['8.8.8.8', '1.1.1.1']);

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
