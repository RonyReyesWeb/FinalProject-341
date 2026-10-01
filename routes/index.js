const router = require('express').Router();

router.get('/', (req, res) => {
  // #swagger.ignore = true
  res.send('CSE 341 Library API — see <a href="/api-docs">/api-docs</a> for documentation.');
});

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));

module.exports = router;
