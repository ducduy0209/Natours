/* eslint-disable */
import '@babel/polyfill'
import { login, logout } from './logged'
import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'
import { signup } from './signup'
import { forgotPassword, resetPassword } from './forgotAndReset'

// DOM ELEMENTS
const loginForm = document.querySelector('.form.form--login')
const mapBox = document.getElementById('map')
const logoutBtn = document.querySelector('.nav__el--loggout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-settings')
const bookTourBtn = document.getElementById('book-tour')
const notifyConfirmEmail = document.querySelector(
  '.notification__confirm-email'
)
const signupForm = document.querySelector('.form.form--signup')
const forgotForm = document.querySelector('.form.form--forgot')
const resetForm = document.querySelector('.form.form--reset')

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.getAttribute('data-locations'))
  displayMap(locations)
}

if (loginForm)
  loginForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--login').textContent = 'Logging...'
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    await login(email, password)
    document.querySelector('.btn--login').textContent = 'Login'
  })

if (logoutBtn) logoutBtn.addEventListener('click', logout)

if (signupForm)
  signupForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--signup').textContent = 'Processing...'
    const form = new FormData()
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append(
      'photo',
      document.getElementById('photo').files[0] || 'default.jpg'
    )
    form.append('password', document.getElementById('password').value)
    form.append(
      'passwordConfirm',
      document.getElementById('passwordConfirm').value
    )
    await signup(form)
    document.querySelector('.btn--signup').textContent = 'Signup'
  })

if (userDataForm)
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--save-data').textContent = 'Saving...'
    const form = new FormData()
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0])
    await updateSettings(form, 'data')
    document.querySelector('.btn--save-data').textContent = 'Save settings'
  })

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--save-password').textContent = 'Updating...'
    const passwordCurrent = document.querySelector('#password-current').value
    const password = document.querySelector('#password').value
    const passwordConfirm = document.querySelector('#password-confirm').value
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    )
    document.querySelector('.btn--save-password').textContent = 'Save password'
    document.querySelector('#password-current').value = ''
    document.querySelector('#password').value = ''
    document.querySelector('#password-confirm').value = ''
  })

if (bookTourBtn)
  bookTourBtn.addEventListener('click', e => {
    e.preventDefault()
    e.target.innerHTML = 'Processing...'
    const { tourId } = e.target.dataset
    bookTour(tourId)
  })

if (notifyConfirmEmail)
  window.setTimeout(() => {
    location.assign('/')
  }, 3000)

if (forgotForm)
  forgotForm.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById('email').value
    document.querySelector('.btn--forgot').textContent = 'Processing...'
    await forgotPassword(email)
    document.querySelector('.btn--forgot').textContent = 'Send email'
  })

if (resetForm)
  resetForm.addEventListener('submit', async e => {
    e.preventDefault()
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('passwordConfirm').value
    document.querySelector('.btn--reset').textContent = 'Processing...'
    await resetPassword(password, passwordConfirm)
    document.querySelector('.btn--reset').textContent = 'Reset Password'
  })
