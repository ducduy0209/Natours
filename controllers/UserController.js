const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}
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
    // Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email')
    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    )
    res.status(200).json({
      status: 'success',
      user: updatedUser
    })
  })

  deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false })

    res.status(204).json({
      status: 'success',
      data: null
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
