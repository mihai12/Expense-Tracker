const { body, validationResult } = require('express-validator');

module.exports.validatePass = body('password')
  .isLength({ min: 8 })
  .trim()
  .withMessage('The password has to be at least 8 characters long.');

module.exports.validatePassMatch = body('password')
  .custom((value, { req }) => {
    if (value !== req.body.confirmPassword) {
      return false;
    }
    return true;
  })
  .withMessage("Passwords don't match");

module.exports.validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please enter a valid email address.');

module.exports.validateUsername = body('username')
  .isLength({ min: 6 })
  .trim()
  .withMessage('The username has to be at least 6 characters long.');

module.exports.validateDescription = body('description')
.isLength({min: 3})
.withMessage('Description has to be at least 3 characters long.')

module.exports.validateAmount = body('description')
.isDecimal()
.withMessage('Amount has to be a number.')


module.exports.validationResult = validationResult;
