const express = require('express')
const ViewController = require('../controllers/ViewController')
const AuthController = require('../controllers/AuthController')
const BookingController = require('../controllers/BookingController')

const router = express.Router()

const CSP = 'Content-Security-Policy'
const POLICY =
  "base-uri 'self';block-all-mixed-content;" +
  "font-src 'self' https: data:;" +
  "frame-ancestors 'self';" +
  "img-src http://localhost:8000 'self' blob: data:;" +
  "object-src 'none';" +
  "script-src https: cdn.jsdelivr.net cdnjs.cloudflare.com api.mapbox.com 'self' blob: ;" +
  "script-src-attr 'none';" +
  "style-src 'self' https: 'unsafe-inline';" +
  'upgrade-insecure-requests;'

router.use((req, res, next) => {
  res.setHeader(CSP, POLICY)
  next()
})

router.get(
  '/',
  BookingController.createBookingCheckout,
  AuthController.isLoggedIn,
  ViewController.getOverview
)
router.get(
  '/my-reviews',
  AuthController.isLoggedIn,
  ViewController.getMyReviews
)
router.get('/tour/:slug', AuthController.isLoggedIn, ViewController.getTour)
router.get('/me', AuthController.protect, ViewController.getAccount)
router.get('/my-tours', AuthController.protect, ViewController.getMyTours)
router.get(
  '/my-favourite-tours',
  AuthController.protect,
  ViewController.getMyFavouriteTours
)
router.get(
  '/confirm-email/:token',
  AuthController.isLoggedIn,
  AuthController.confirmEmail
)
router.use(AuthController.isLoggedIn)

router.get('/forgot-password', ViewController.getForgotPasswordForm)
router.get('/reset-password/:token', ViewController.resetPasswordForm)
router.get('/login', ViewController.getLoginForm)
router.get('/signup', ViewController.getSignupForm)

module.exports = router
