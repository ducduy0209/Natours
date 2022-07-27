const express = require('express')
const ViewController = require('../controllers/ViewController')

const router = express.Router()

router.get('/', ViewController.getOverview)

router.get('/tour/:slug', ViewController.getTour)

module.exports = router
