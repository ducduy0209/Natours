/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'
const $ = document.querySelector.bind(document)

export const fillFullInforFormTour = async id => {
  try {
    const tour = await axios({
      method: 'get',
      url: `/api/v1/tours/${id}`
    })
    $('#name').value = tour.data.data.data.name
    $('#price').value = tour.data.data.data.price
    $('#summary').value = tour.data.data.data.summary
    $('#duration').value = tour.data.data.data.duration
    $('#maxGroupSize').value = tour.data.data.data.maxGroupSize
    $('#description').value = tour.data.data.data.description
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const editTour = async (id, data) => {
  try {
    const res = await axios({
      method: 'patch',
      url: `/api/v1/tours/${id}`,
      data
    })
    if (res.data.status === 'success') {
      showAlert('success', 'Update tour successfully.')
      window.setTimeout(() => {
        window.location.reload('true')
      }, 2000)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
