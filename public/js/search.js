/* eslint-disable */
import axios from 'axios'
import showAlert from './alerts'

export const searchTour = async text => {
  try {
    const textCovert = text.split(' ').join('-')
    const res = await axios({
      method: 'get',
      url: `/api/v1/tours/search/${textCovert}}`
    })
    if (res.data.status === 'success') {
      document.querySelector(
        '.results__search .description p span'
      ).textContent = res.data.results
      const ulElemnt = document.querySelector('.results__search')
      const b = res.data.data.tours.map(
        tour => `
            <li class="result__item">
            <img src='/img/tours/${tour.imageCover}' alt="Image cover of this tour"/>
            <a class="result__item-link" href='/tour/${tour.slug}'>${tour.name}</a>
            </li>
            `
      )
      ulElemnt.insertAdjacentHTML('beforeend', b.join(' '))
      ulElemnt.style.display = 'block'
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
