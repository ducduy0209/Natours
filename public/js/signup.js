/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

export const signup = async data => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:8080/api/v1/users/signup',
      data
    })
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Signup successfully! Please check your email to active your account'
      )
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
