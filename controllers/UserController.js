const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

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
