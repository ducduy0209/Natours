const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const HandlerFactory = require('./HandlerFactory')

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1]
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(
      new AppError('Not an image file. Please upload only images.', 400),
      false
    )
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}
class UserController {
  resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next()

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 92 })
      .toFile(`public/img/users/${req.file.filename}`)

    next()
  })

  uploadUserPhoto = upload.single('photo')

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

    if (req.file) {
      filteredBody.photo = req.file.filename
    }
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

  getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
  }

  createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined. Please use /signup instead.'
    })
  }

  // Do NOT update Password with this
  getAllUsers = HandlerFactory.getAll(User)

  getUser = HandlerFactory.getOne(User)

  updateUser = HandlerFactory.updateOne(User)

  deleteUser = HandlerFactory.deleteOne(User)
}

module.exports = new UserController()
