const jwt = require('jsonwebtoken')
const responser = require('../modules/responser')

module.exports = (authRoutes) => {
  authRoutes.use((req, res, next) => {
    // check header parameters for token
    let token = req.headers['authorization']

    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, 'superSecret', function (err, decoded) {
        if (err) {
          return responser.errorResponseStatus(res, 401, 'Failed to authenticate token')
        } else {
          // if everything is good, save to request for use in other routes
          req.user = decoded
          next()
        }
      })

    } else {
      // if there is no token
      // return an error
      return responser.errorResponseStatus(res, 401, 'No token provided.')
    }
  })
}