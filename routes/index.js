const router = require('express').Router();

const escapeHtml = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

router.use('/', require('./auth'));

router.get('/', (req, res) => {
  const user = req.isAuthenticated() ? req.user : null;
  res.send(`
    <h1>CSE 341 Library API</h1>
    ${
      user
        ? `<p>Logged in as <strong>${escapeHtml(user.displayName)}</strong>. <a href="/logout">Log out</a></p>`
        : '<p>You are logged out. <a href="/login">Log in with GitHub</a></p>'
    }
    <p><a href="/api-docs">API documentation (Swagger)</a></p>
  `);
});

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
router.use('/members', require('./members'));
router.use('/loans', require('./loans'));

module.exports = router;
