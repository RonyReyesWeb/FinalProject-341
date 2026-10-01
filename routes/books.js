const router = require('express').Router();
const ctrl = require('../controllers/books');
const { idRule, bookRules, handleValidation } = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', idRule, handleValidation, ctrl.getSingle);
router.post('/', bookRules, handleValidation, ctrl.create);
router.put('/:id', idRule, bookRules, handleValidation, ctrl.update);
router.delete('/:id', idRule, handleValidation, ctrl.remove);

module.exports = router;
