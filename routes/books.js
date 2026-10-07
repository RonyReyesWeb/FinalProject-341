const router = require('express').Router();
const ctrl = require('../controllers/books');
const { idRule, bookRules, handleValidation } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/auth');

// Public
router.get('/', ctrl.getAll);
router.get('/:id', idRule, handleValidation, ctrl.getSingle);

// Protected: must be logged in with GitHub
router.post('/', isAuthenticated, bookRules, handleValidation, ctrl.create);
router.put('/:id', isAuthenticated, idRule, bookRules, handleValidation, ctrl.update);
router.delete('/:id', isAuthenticated, idRule, handleValidation, ctrl.remove);

module.exports = router;
