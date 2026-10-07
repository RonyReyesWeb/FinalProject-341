const app = require('./app');
const { initDb } = require('./db/connect');

const port = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
