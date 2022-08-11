/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

// type is 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? 'http://localhost:8080/api/v1/users/updateMe'
        : 'http://localhost:8080/api/v1/users/updateMyPassword'
    const res = await axios({
      method: 'patch',
      url,
      data
    })
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
