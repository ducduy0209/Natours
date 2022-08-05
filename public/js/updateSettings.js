/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://localhost:8080/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    })
    if (res.data.status === 'success') {
      showAlert('success', 'Update your data successfully!')
    }
    window.setTimeout(() => {
      location.reload(true)
    }, 2000)
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
