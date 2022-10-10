/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

export const fillFullInforFormReview = async id => {
  try {
    const res = await axios({
      method: 'get',
      url: `/api/v1/reviews/${id}`
    })

    if (res.data.status === 'success') {
      document.getElementById('review-text').value = res.data.data.data.review
      document.getElementById('review-rating').value = res.data.data.data.rating
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const manageEditReview = async (id, data) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `/api/v1/reviews/${id}`,
      data
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Update review successfully!')
      window.setTimeout(() => {
        window.location.reload(true)
      }, 3000)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
