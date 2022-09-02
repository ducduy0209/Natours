const Tour = require('../models/tourModel')
const Booking = require('../models/bookingModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

class ViewController {
  getOverview = catchAsync(async (req, res, next) => {
    // 1) Get all tours from collection
    const tours = await Tour.find()
    // 2) Build template
    // 3) Render that template using tour data from 1)

    res.status(200).render('overview', {
      title: 'All tours',
      tours
    })
  })

  getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour(including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'rating review user'
    })

    if (!tour) return next(new AppError('There is no tour with that name', 404))

    // 2) Build template
    // 3) Render that template using data from 1)
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour
    })
  })

  getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all booking
    const bookings = await Booking.find({ user: req.user.id })
    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour)
    const tours = await Tour.find({ _id: { $in: tourIDs } })

    res.status(200).render('overview', {
      title: 'My tours',
      tours
    })
  })

  getLoginForm = (req, res) => {
    if (req.user) {
      return res.status(200).redirect(`/`)
    }
    return res.status(200).render('login', {
      title: 'Log into your account'
    })
  }

  getAccount = (req, res) => {
    res.status(200).render('account', {
      title: 'Your account'
    })
  }

  getSignupForm = (req, res) => {
    if (req.user) {
      return res.status(200).redirect(`/`)
    }
    return res.status(200).render('signup', {
      title: 'Signup your account'
    })
  }

  getForgotPasswordForm = (req, res) => {
    if (req.user) {
      return res.status(200).redirect(`/`)
    }
    return res.status(200).render('forgotPassword', {
      title: 'Forgot your password'
    })
  }

  resetPasswordForm = (req, res) => {
    if (req.user) {
      return res.status(200).redirect(`/`)
    }
    return res.status(200).render('resetPassword', {
      title: 'Reset your password'
    })
  }
}

module.exports = new ViewController()
