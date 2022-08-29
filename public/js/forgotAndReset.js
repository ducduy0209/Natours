/* eslint-disable */
import axios from 'axios'
import catchAsync from '../../utils/catchAsync'
import { showAlert } from './alerts'

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/forgotPassword',
      data: {
        email
      }
    })
    if (res.data.status === 'success') {
      showAlert('success', 'Please check your email to reset your password!')
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const resetPassword = async (password, passwordConfirm) => {
  try {
    const token = window.location.href.split('reset-password/')[1]
    const res = await axios({
      method: 'patch',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    })
    if (res.data.status === 'success') {
      showAlert('success', 'Reset your password successfully!')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    console.log(err)
    showAlert('error', err.response.data.message)
  }
}
