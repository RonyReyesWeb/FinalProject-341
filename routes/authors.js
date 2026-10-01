const router = require('express').Router();
const ctrl = require('../controllers/authors');
const { idRule, authorRules, handleValidation } = require('../middleware/validate');

router.get('/', ctrl.getAll);
router.get('/:id', idRule, handleValidation, ctrl.getSingle);
router.post('/', authorRules, handleValidation, ctrl.create);
router.put('/:id', idRule, authorRules, handleValidation, ctrl.update);
router.delete('/:id', idRule, handleValidation, ctrl.remove);

module.exports = router;
