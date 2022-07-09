const express = require('express')
const UserController = require('../controllers/UserController')
const AuthController = require('../controllers/AuthController')

const router = express.Router()

router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)

router.post('/forgotPassword', AuthController.forgotPassword)
router.patch('/resetPassword/:token', AuthController.resetPassword)

router.patch(
  '/updateMyPassword',
  AuthController.protect,
  AuthController.updatePassword
)

router.patch('/updateMe', AuthController.protect, UserController.updateMe)
router.delete('/deleteMe', AuthController.protect, UserController.deleteMe)

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
