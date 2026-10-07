// Blocks the request with 401 unless the user logged in through GitHub OAuth
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'You must be logged in to do this. Visit /login first.' });
};

module.exports = { isAuthenticated };
