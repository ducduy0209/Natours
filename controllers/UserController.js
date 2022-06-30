const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

class UserController {
  getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find()

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    })
  })

  updateMe = catchAsync(async (req, res, next) => {
    // Create error if user POSTs password date
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword. ',
          401
        )
      )
    }
    // Update user document

    res.status(200).json({
      status: 'success'
    })
  })

  createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    })
  }

  getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    })
  }

  updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    })
  }

  deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    })
  }
}

module.exports = new UserController()
