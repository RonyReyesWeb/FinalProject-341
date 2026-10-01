const { body, param, validationResult } = require('express-validator');

// Sends 400 with all validation messages if any rule failed
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

const idRule = [param('id').isMongoId().withMessage('id must be a valid 24-character MongoDB ObjectId')];

const authorRules = [
  body('firstName').trim().notEmpty().withMessage('firstName is required').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('lastName is required').isLength({ max: 50 }),
  body('birthDate')
    .notEmpty().withMessage('birthDate is required')
    .isISO8601().withMessage('birthDate must be a date in YYYY-MM-DD format'),
  body('nationality').trim().notEmpty().withMessage('nationality is required'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('email must be a valid email').normalizeEmail()
];

const bookRules = [
  body('title').trim().notEmpty().withMessage('title is required').isLength({ max: 200 }),
  body('authorId').isMongoId().withMessage('authorId must be a valid MongoDB ObjectId of an existing author'),
  body('isbn')
    .trim()
    .notEmpty().withMessage('isbn is required')
    .matches(/^(97[89])?\d{9}[\dX]$/).withMessage('isbn must be a 10 or 13 digit ISBN (no dashes)'),
  body('genre').trim().notEmpty().withMessage('genre is required'),
  body('publishedYear')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`publishedYear must be an integer between 1000 and ${new Date().getFullYear()}`)
    .toInt(),
  body('pages').isInt({ min: 1 }).withMessage('pages must be a positive integer').toInt(),
  body('publisher').trim().notEmpty().withMessage('publisher is required'),
  body('available').optional().isBoolean().withMessage('available must be true or false').toBoolean()
];

module.exports = { handleValidation, idRule, authorRules, bookRules };
