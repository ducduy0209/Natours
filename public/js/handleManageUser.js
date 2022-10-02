/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

export const fillFormUserEdit = async id => {
  try {
    const res = await axios({
      method: 'get',
      url: `/api/v1/users/${id}`
    })
    if (res.data.status === 'success') {
      document.getElementById('name-user').value = res.data.data.data.name
      document.getElementById('email-user').value = res.data.data.data.email
      const select = document.getElementById('role')
      const options = Array.from(select.options)
      const optionToSelect = options.find(
        item => item.value === res.data.data.data.role
      )
      // Here's the trick:
      select.value = optionToSelect.value
    }
  } catch (e) {
    showAlert('error', e.response.data.message)
  }
}

export const editUser = async (id, data) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `/api/v1/users/${id}`,
      data
    })

    console.log(res)

    if (res.data.status === 'success') {
      showAlert('success', 'Update user successfully!')
      window.setTimeout(() => {
        window.location.reload(true)
      }, 3000)
    }
  } catch (e) {
    showAlert('error', e.response.data.message)
  }
}
