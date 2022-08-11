const express = require('express')
const UserController = require('../controllers/UserController')
const AuthController = require('../controllers/AuthController')

const router = express.Router()

router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)
router.get('/logout', AuthController.logout)

router.post('/forgotPassword', AuthController.forgotPassword)
router.patch('/resetPassword/:token', AuthController.resetPassword)

router.use(AuthController.protect)

router.patch('/updateMyPassword', AuthController.updatePassword)
router.get('/me', UserController.getMe, UserController.getUser)
router.patch(
  '/updateMe',
  UserController.uploadUserPhoto,
  UserController.resizeUserPhoto,
  UserController.updateMe
)
router.delete('/deleteMe', UserController.deleteMe)

router.use(AuthController.restrictTo('admin'))

router
  .route('/')
  .get(UserController.getAllUsers)
  .post(UserController.createUser)
router
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser)

module.exports = router
