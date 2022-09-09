/* eslint-disable */
export const handleRangtings = () => {
  const increaseBtn = document.querySelector('#add')
  const reduceBtn = document.querySelector('#subtract')
  const inputRatings = document.querySelector('#review-rating')

  increaseBtn.addEventListener('click', () => {
    if (inputRatings.value < 5) {
      inputRatings.value = parseFloat(inputRatings.value) + 0.5
    }
  })

  reduceBtn.addEventListener('click', () => {
    if (inputRatings.value > 1) {
      inputRatings.value = parseFloat(inputRatings.value) - 0.5
    }
  })
}

export const hideModel = () => {
  const closeBtn = document.querySelector('.close__review')
  const overlay = document.querySelector('.model-review__overlay')

  closeBtn.addEventListener('click', () => {
    document.querySelector('.model__review').classList.remove('open')
  })

  overlay.addEventListener('click', () => {
    document.querySelector('.model__review').classList.remove('open')
  })
}
