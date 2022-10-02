/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'
const reviewTour = async (data, id, type) => {
  try {
    const method = type === 'create' ? 'post' : 'patch'
    const url =
      type === 'create'
        ? `/api/v1/tours/${id}/reviews`
        : `/api/v1/reviews/${id}`
    const res = await axios({
      method,
      url,
      data
    })
    if (type === 'create') {
      if (res.data.status === 'success') {
        showAlert('success', 'Review tour successfully')
        window.setTimeout(() => {
          location.reload(true)
        }, 1200)
      }
    } else {
      if (res.data.status === 'success') {
        showAlert('success', 'Edit review tour successfully')
        window.setTimeout(() => {
          location.reload(true)
        }, 1200)
      }
    }
  } catch (err) {
    if (err.response.data.message.indexOf('duplicate') > -1) {
      showAlert('error', 'You can only review one tour one time.')
    } else {
      showAlert('error', err.response.data.message)
    }
  }
}

export const handleReviewTour = async type => {
  document.querySelector('.btn--review').textContent = 'Processing...'
  const id =
    type === 'create'
      ? document.querySelector('.btn--review').dataset.tourIdReview
      : document.querySelector('.btn--review').dataset.reviewId
  const review = document.getElementById('review-text').value
  const rating = parseFloat(document.getElementById('review-rating').value)
  await reviewTour({ review, rating }, id, type)
  document.querySelector('.btn--review').textContent = 'Review'
}

export const deleteReviewTour = async reviewId => {
  try {
    const res = await axios({
      method: 'delete',
      url: `/api/v1/reviews/${reviewId}`
    })
    if (res.data.length === 0) {
      showAlert('success', 'Delete review tour successfully')
      window.setTimeout(() => {
        location.reload(true)
      }, 1200)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
