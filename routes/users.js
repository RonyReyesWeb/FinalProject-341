const router = require('express').Router();
const ctrl = require('../controllers/users');
const { idRule, handleValidation } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/auth');

// Users are created automatically when someone logs in with GitHub.
// All user routes require login.
router.get('/', isAuthenticated, ctrl.getAll);
router.get('/me', isAuthenticated, ctrl.getMe);
router.get('/:id', isAuthenticated, idRule, handleValidation, ctrl.getSingle);
router.delete('/:id', isAuthenticated, idRule, handleValidation, ctrl.remove);

module.exports = router;
