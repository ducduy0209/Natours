/* eslint-disable */
import '@babel/polyfill'
import { login, logout } from './logged'
import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'
import { signup } from './signup'
import { forgotPassword, resetPassword } from './forgotAndReset'
import { handleRangtings, hideModel } from './handleReviewModel'
import { handleReviewTour, deleteReviewTour } from './review'
import { handleLikeTourBrowser } from './handleLikeTour'
import { searchTour } from './search'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
// DOM ELEMENTS
const loginForm = $('.form.form--login')
const mapBox = $('#map')
const logoutBtn = $('.nav__el--loggout')
const userDataForm = $('.form-user-data')
const userPasswordForm = $('.form-user-settings')
const bookTourBtn = $('#book-tour')
const notifyConfirmEmail = $('.notification__confirm-email')
const signupForm = $('.form.form--signup')
const forgotForm = $('.form.form--forgot')
const resetForm = $('.form.form--reset')
const reviewPopup = $('.btn.btn__review-popup')
const reviewForm = $('.form.form--review')
const likedTourBtn = $('.heart--icon__liked.active')
const likeTourBtn = $('.heart--icon.active')
const editReviewBtn = $$('.review__edit-icon')
const deleteReviewBtnsPopup = $$('.review__trash-icon')
const deleteReviewForm = $('.model__deleteReview-form')
const deleteReviewBtn = $('.model__deleteReview-btn-delete')
const cancelReviewDeleteBtn = $('.model__deleteReview-btn-cancel')
const inputSearchTour = $('.nav__search-input')
const listResultsSearch = $('.results__search')
const navSearch = $('.nav__search')
let typingTimer

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.getAttribute('data-locations'))
  displayMap(locations)
}

navSearch.addEventListener('submit', async e => {
  e.preventDefault()
  if (inputSearchTour.value !== '') {
    if (listResultsSearch.children.length > 1) {
      for (let i = 1; i < listResultsSearch.children.length; i++) {
        listResultsSearch.removeChild(listResultsSearch.children[i])
        i--
      }
    }
    $('.dashed-loading').style.display = 'block'
    await searchTour(inputSearchTour.value)
    $('.dashed-loading').style.display = 'none'
  }
})

inputSearchTour.addEventListener('blur', () => {
  setTimeout(() => {
    listResultsSearch.style.display = 'none'
  }, 10)
})

inputSearchTour.addEventListener('input', () => {
  listResultsSearch.style.display = 'none'
})

inputSearchTour.addEventListener('focus', () => {
  if (inputSearchTour.value !== '' && listResultsSearch.children.length > 1)
    listResultsSearch.style.display = 'block'
})

if (loginForm)
  loginForm.addEventListener('submit', async e => {
    e.preventDefault()
    $('.btn--login').textContent = 'Logging...'
    const email = $('#email').value
    const password = $('#password').value
    await login(email, password)
    $('.btn--login').textContent = 'Login'
  })

if (logoutBtn) logoutBtn.addEventListener('click', logout)

if (signupForm)
  signupForm.addEventListener('submit', async e => {
    e.preventDefault()
    $('.btn--signup').textContent = 'Processing...'
    const form = new FormData()
    form.append('name', $('#name').value)
    form.append('email', $('#email').value)
    form.append('photo', $('#photo').files[0] || 'default.jpg')
    form.append('password', $('#password').value)
    form.append('passwordConfirm', $('#passwordConfirm').value)
    await signup(form)
    $('.btn--signup').textContent = 'Signup'
  })

if (userDataForm)
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault()
    $('.btn--save-data').textContent = 'Saving...'
    const form = new FormData()
    form.append('name', $('#name').value)
    form.append('email', $('#email').value)
    form.append('photo', $('#photo').files[0])
    await updateSettings(form, 'data')
    $('.btn--save-data').textContent = 'Save settings'
  })

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault()
    $('.btn--save-password').textContent = 'Updating...'
    const passwordCurrent = $('#password-current').value
    const password = $('#password').value
    const passwordConfirm = $('#password-confirm').value
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    )
    $('.btn--save-password').textContent = 'Save password'
    $('#password-current').value = ''
    $('#password').value = ''
    $('#password-confirm').value = ''
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
    const email = $('#email').value
    $('.btn--forgot').textContent = 'Processing...'
    await forgotPassword(email)
    $('.btn--forgot').textContent = 'Send email'
  })

if (resetForm)
  resetForm.addEventListener('submit', async e => {
    e.preventDefault()
    const password = $('#password').value
    const passwordConfirm = $('#passwordConfirm').value
    $('.btn--reset').textContent = 'Processing...'
    await resetPassword(password, passwordConfirm)
    $('.btn--reset').textContent = 'Reset Password'
  })

if (editReviewBtn) {
  for (const btn of editReviewBtn) {
    btn.addEventListener('click', e => {
      $('.btn--review').dataset.reviewId = e.target.dataset.reviewId
      $('.model__review').classList.add('open')
    })
  }
}

if (deleteReviewBtnsPopup) {
  for (const btn of deleteReviewBtnsPopup) {
    btn.addEventListener('click', e => {
      $('.model__deleteReview-btn-delete').dataset.reviewId =
        e.target.dataset.reviewIdDelete
      $('.model__deleteReview').classList.add('open')
    })
  }
}

if (deleteReviewForm) {
  deleteReviewForm.addEventListener('submit', e => {
    e.preventDefault()
  })
  deleteReviewBtn.addEventListener('click', async e => {
    const { reviewId } = e.target.dataset
    deleteReviewBtn.textContent = 'Processing...'
    await deleteReviewTour(reviewId)
    deleteReviewBtn.textContent = 'Delete'
  })
  cancelReviewDeleteBtn.addEventListener('click', () => {
    $('.model__deleteReview').classList.remove('open')
  })
  $('.model__deleteReview-overlay').addEventListener('click', () => {
    $('.model__deleteReview').classList.remove('open')
  })
}

if (reviewPopup)
  reviewPopup.addEventListener('click', () => {
    $('.model__review').classList.add('open')
  })

if (reviewForm) {
  handleRangtings()
  hideModel()
  reviewForm.addEventListener('submit', async e => {
    e.preventDefault()
    if (editReviewBtn.length > 0) {
      console.log('hi')
      await handleReviewTour('edit')
    } else {
      console.log('hello')
      await handleReviewTour('create')
    }
  })
}

if (likedTourBtn) {
  handleLikeTourBrowser(likedTourBtn, 'liked')
}

if (likeTourBtn) {
  handleLikeTourBrowser(likeTourBtn, 'like')
}
