const { validationResult, body } = require('express-validator')
const responser = require('../configs/responser')

exports.formValidate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw responser.formErrorValidationResponse(errors.array(), res)
  }
}

exports.register = [
  body(['username']).notEmpty().withMessage('Username required'),
  body(['name']).notEmpty().withMessage('Name required'),
  body(['password']).notEmpty().withMessage('Password required'),
  body(['password_confirmation']).notEmpty().withMessage('Password Confirmation required'),
]