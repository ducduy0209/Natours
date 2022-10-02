/* eslint-disable */

import axios from 'axios'
import { showAlert } from './alerts'

// Type is user or review or tour
export const deleteOne = async (id, type) => {
  try {
    let url, message
    if (type === 'review') {
      url = `/api/v1/reviews/${id}`
      message = 'Delete review tour successfully'
    } else if (type === 'tour') {
      url = `/api/v1/tours/${id}`
      message = 'Delete tour successfully'
    } else {
      url = `/api/v1/users/${id}`
      message = 'Delete user successfully'
    }
    const res = await axios({
      method: 'delete',
      url
    })
    if (res.data.length === 0) {
      showAlert('success', message)
      window.setTimeout(() => {
        location.reload(true)
      }, 1200)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
