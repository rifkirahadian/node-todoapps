const { validationResult, body } = require('express-validator')
const responser = require('./responser')

//validation form handle
exports.formValidate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw responser.formErrorValidationResponse(errors.array(), res)
  }
}

//register validation rule
exports.register = [
  body(['username']).notEmpty().withMessage('Username required'),
  body(['name']).notEmpty().withMessage('Name required'),
  body(['password']).notEmpty().withMessage('Password required'),
  body(['password_confirmation']).notEmpty().withMessage('Password Confirmation required'),
  body(['password_confirmation']).custom((value, { req }) => value === req.body.password).withMessage('Password Confirmation must same with password'),
]

//login validation rule
exports.login = [
  body(['username']).notEmpty().withMessage('Username required'),
  body(['password']).notEmpty().withMessage('Password required'),
]

exports.createTaskSingleString = [
  body(['task']).notEmpty().withMessage('Task required'),
]