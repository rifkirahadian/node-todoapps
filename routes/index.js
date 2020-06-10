const AuthController = require('../controllers/AuthController')
const validator = require('../modules/validator')

const authController = new AuthController

module.exports = (app, express) => {
  const apiRoutes = express.Router()
  const authRoutes = express.Router()

  //middleware
  require('../middlewares/Auth')(authRoutes)

  apiRoutes.post('/register',validator.register, authController.register)
  apiRoutes.post('/login',validator.login, authController.login)

  app.use('/api', apiRoutes)
  app.use('/api', authRoutes)
}