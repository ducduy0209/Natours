/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

const handleLikeTourAPI = async tourId => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/likeTour',
      data: {
        tourId
      }
    })

    if (res.data.status === 'success') {
      showAlert('success', `${res.data.message}`)
      window.setTimeout(() => {
        location.reload(true)
      }, 1000)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export const openLoading = type => {
  if (type === 'like') {
    document.querySelector('.heart--icon').classList.remove('active')
    document.querySelector('.heart--icon').classList.add('hide')
    document.querySelector('.circle-loading').classList.remove('hide')
  }

  if (type === 'liked') {
    document.querySelector('.heart--icon__liked').classList.remove('active')
    document.querySelector('.heart--icon__liked').classList.add('hide')
    document.querySelector('.circle-loading').classList.remove('hide')
  }
}

export const closeLoading = type => {
  if (type === 'like') {
    document.querySelector('.heart--icon__liked').classList.add('active')
    document.querySelector('.heart--icon__liked').classList.remove('hide')
    document.querySelector('.description__heart').textContent =
      'Click to remove from your favorites'
    document.querySelector('.circle-loading').classList.add('hide')
  }

  if (type === 'liked') {
    document.querySelector('.heart--icon').classList.add('active')
    document.querySelector('.heart--icon').classList.remove('hide')
    document.querySelector('.description__heart').textContent =
      'Click to add to your favorites'
    document.querySelector('.circle-loading').classList.add('hide')
  }
}

export const handleLikeTourBrowser = (btn, type) => {
  document.querySelector('.description__heart').textContent =
    type === 'liked'
      ? 'Click to remove from your favorites'
      : 'Click to add to your favorites'
  btn.addEventListener('click', async e => {
    const { tourId } = e.target.dataset
    openLoading(type)
    await handleLikeTourAPI(tourId)
    closeLoading(type)
  })
}
