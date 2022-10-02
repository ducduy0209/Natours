const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')
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

  getMyReviews = catchAsync(async (req, res, next) => {
    if (!req.user) {
      return res.status(200).redirect(`/`)
    }
    // 1) Find all review
    const reviews = await Review.find({ user: req.user.id })
    // 2) Find tours with the returned IDs
    const tourIDs = reviews.map(el => el.tour)
    const tours = await Tour.find({ _id: { $in: tourIDs } })
    return res.status(200).render('reviews', {
      title: 'My reviews',
      tours,
      reviews,
      deleteReview: true
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
      title: 'My account'
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

  getMyFavouriteTours = async (req, res) => {
    // 1) Find all favorites tours
    const user = await User.findOne({ _id: req.user.id })
    // 2) Find tours with the returned IDs
    const tourIDs = user.favouriteTours.map(el => el._id)
    const tours = await Tour.find({ _id: { $in: tourIDs } })

    res.status(200).render('overview', {
      title: 'My favorites tours',
      tours
    })
  }

  alerts = (req, res, next) => {
    const { alert } = req.query
    if (alert === 'booking')
      res.locals.alert =
        "Your booking was successfully! Please check your email for a comfirmation. if your booking doesn't show up here immediatly, please come back later."
    next()
  }

  getManageToursForm = catchAsync(async (req, res, next) => {
    const tours = await Tour.find()

    res.status(200).render('overview', {
      title: 'Manage tours',
      tours,
      edit: true
    })
  })

  getManageUsersForm = catchAsync(async (req, res, next) => {
    const users = await User.find()
    res.status(200).render('manageUsers', {
      title: 'Manage users',
      users,
      deleteUser: true
    })
  })
}

module.exports = new ViewController()
