/* eslint-disable */
import '@babel/polyfill'
import { login, logout } from './logged'
import { showAlert } from './alerts'
import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'
import { signup } from './signup'
import { forgotPassword, resetPassword } from './forgotAndReset'
import { handleRangtings, hideModel } from './handleReviewModel'
import { handleReviewTour, deleteReviewTour } from './review'
import { handleLikeTourBrowser } from './handleLikeTour'
import { searchTour } from './search'
import { fillFullInforFormTour, editTour } from './handleEditTour'
import { deleteOne } from './deleteOne'
import { fillFormUserEdit, editUser } from './handleManageUser'
import { fillFullInforFormReview, manageEditReview } from './handleManageReview'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
// DOM ELEMENTS
const alertMessage = $('body').dataset.alert
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
const editReviewBtns = $$('.review__edit-icon')
const deleteReviewBtnsPopup = $$('.review__trash-icon')
const deleteReviewForm = $('.model__deleteReview-form')
const deleteReviewBtn = $('.model__deleteReview-btn-delete')
const cancelReviewDeleteBtn = $('.model__deleteReview-btn-cancel')
const inputSearchTour = $('.nav__search-input')
const listResultsSearch = $('.results__search')
const navSearch = $('.nav__search')
const editTourForm = $('.form--edit-tour')
const editFormPopupBtns = $$('.btn--popup__edit-tour')
const editTourModel = $('.model__editTour')
const editTourBtn = $('.model__editTour-btn-edit')
const deleteTourBtn = $('.model__editTour-btn-delete')
const deleteUserBtnsPopup = $$('.user__delete-icon')
const deleteUserForm = $('.model__deleteUser-form')
const deleteUserBtn = $('.model__deleteUser-btn-delete')
const editUserBtnsPopup = $$('.user__edit-icon')
const editUserForm = $('.form--edit-user')
const editUserBtn = $('.btn--update-user')
const manageDeleteReviewBtnsPopup = $$('.manageReview__delete-icon')
const manageEditReviewBtnsPopup = $$('.manageReview__edit-icon')

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.getAttribute('data-locations'))
  displayMap(locations)
}

if (navSearch) {
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
}

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

if (editReviewBtns.length > 0) {
  for (const btn of editReviewBtns) {
    btn.addEventListener('click', e => {
      $('.btn--review').dataset.reviewId = e.target.dataset.reviewId
      $('.model__review').classList.add('open')
    })
  }
}

if (deleteReviewBtnsPopup.length > 0) {
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
    await deleteOne(reviewId, 'review')
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
  if (manageEditReviewBtnsPopup.length <= 0) {
    reviewForm.addEventListener('submit', async e => {
      e.preventDefault()
      if (editReviewBtns.length > 0) {
        await handleReviewTour('edit')
      } else {
        await handleReviewTour('create')
      }
    })
  }
}

if (likedTourBtn) {
  handleLikeTourBrowser(likedTourBtn, 'liked')
}

if (likeTourBtn) {
  handleLikeTourBrowser(likeTourBtn, 'like')
}

if (alertMessage) showAlert('success', alertMessage, 15)

if (editFormPopupBtns.length > 0) {
  for (const btn of editFormPopupBtns) {
    btn.addEventListener('click', async e => {
      const { tourId } = e.target.dataset
      btn.textContent = 'Waiting...'
      await fillFullInforFormTour(tourId)
      editTourBtn.dataset.tourId = tourId
      $('.model__editTour-btn-delete').dataset.tourIdDelete = tourId
      editTourModel.classList.add('open')
      btn.textContent = 'Edit'
    })
  }

  editTourBtn.addEventListener('click', async e => {
    const id = editTourBtn.dataset.tourId
    editTourBtn.textContent = 'Editing...'
    const form = new FormData()
    form.append('name', $('#name').value)
    form.append('price', $('#price').value)
    form.append('duration', $('#duration').value)
    form.append('description', $('#description').value)
    form.append('summary', $('#summary').value)
    form.append('maxGroupSize', $('#maxGroupSize').value)
    await editTour(id, form)
    editTourBtn.textContent = 'Edit'
  })

  deleteTourBtn.addEventListener('click', async e => {
    const id = deleteTourBtn.dataset.tourIdDelete
    deleteTourBtn.textContent = 'Deleting...'
    await deleteOne(id, 'tour')
    deleteTourBtn.textContent = 'Delete'
  })

  $('.model__editTour-overlay').addEventListener('click', () => {
    editTourModel.classList.remove('open')
  })
  $('.model__editTour-btn-cancel').addEventListener('click', () => {
    editTourModel.classList.remove('open')
  })
}

if (editTourForm)
  editTourForm.addEventListener('submit', e => {
    e.preventDefault()
  })

if (deleteUserBtnsPopup.length > 0) {
  for (const btn of deleteUserBtnsPopup) {
    btn.addEventListener('click', e => {
      deleteUserBtn.dataset.userIdDelete = e.target.dataset.userIdDelete
      $('.model__deleteUser').classList.add('open')
    })
  }

  deleteUserForm.addEventListener('submit', e => {
    e.preventDefault()
  })

  deleteUserBtn.addEventListener('click', async () => {
    const id = deleteUserBtn.dataset.userIdDelete
    deleteUserBtn.textContent = 'Processing...'
    await deleteOne(id, 'user')
    deleteUserBtn.textContent = 'Delete'
  })

  $('.model__deleteUser-btn-cancel').addEventListener('click', () => {
    $('.model__deleteUser').classList.remove('open')
  })

  $('.model__deleteUser-overlay').addEventListener('click', () => {
    $('.model__deleteUser').classList.remove('open')
  })
}

if (editUserBtnsPopup.length > 0) {
  for (const btn of editUserBtnsPopup) {
    btn.addEventListener('click', async () => {
      btn.style.display = 'none'
      btn.parentElement.querySelector('.user__edit-load').style.display =
        'inline-block'
      await fillFormUserEdit(btn.dataset.userId)
      btn.style.display = 'inline-block'
      btn.parentElement.querySelector('.user__edit-load').style.display = 'none'
      editUserBtn.dataset.userIdEdit = btn.dataset.userId
      $('.model__editUser').classList.add('open')
    })
  }

  editUserForm.addEventListener('submit', e => {
    e.preventDefault()
  })

  editUserBtn.addEventListener('click', async () => {
    const id = editUserBtn.dataset.userIdEdit
    const name = $('#name-user').value
    const email = $('#email-user').value
    const role = $('#role').value
    editUserBtn.textContent = 'Processing...'
    await editUser(id, { name, email, role })
    editUserBtn.textContent = 'Update'
  })

  $('.model-editUser__overlay').addEventListener('click', () => {
    $('.model__editUser').classList.remove('open')
  })

  $('.close__edit-user').addEventListener('click', () => {
    $('.model__editUser').classList.remove('open')
  })
}

if (manageDeleteReviewBtnsPopup.length > 0) {
  for (const btn of manageDeleteReviewBtnsPopup) {
    btn.addEventListener('click', e => {
      $('.model__deleteReview-btn-delete').dataset.reviewId =
        e.target.dataset.reviewIdDelete
      $('.model__deleteReview').classList.add('open')
    })
  }
}

if (manageEditReviewBtnsPopup.length > 0) {
  for (const btn of manageEditReviewBtnsPopup) {
    btn.addEventListener('click', async e => {
      btn.style.display = 'none'
      btn.parentElement.querySelector(
        '.manageReview__load-icon'
      ).style.display = 'inline-block'
      await fillFullInforFormReview(btn.dataset.reviewId)
      btn.style.display = 'inline-block'
      btn.parentElement.querySelector(
        '.manageReview__load-icon'
      ).style.display = 'none'
      $('.btn--review').dataset.reviewId = e.target.dataset.reviewId
      $('.model__review ').classList.add('open')
    })
  }

  reviewForm.addEventListener('submit', e => e.preventDefault())

  $('.btn--review').addEventListener('click', async e => {
    const id = e.target.dataset.reviewId
    const review = document.getElementById('review-text').value
    const rating = document.getElementById('review-rating').value
    $('.btn--review').textContent = 'Processing...'
    await manageEditReview(id, { review, rating })
    $('.btn--review').textContent = 'Review'
  })
}
