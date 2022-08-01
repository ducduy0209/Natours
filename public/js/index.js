/* eslint-disable */
import '@babel/polyfill'
import { login, logout } from './logged'
import { displayMap } from './mapbox'

// DOM ELEMENTS
const loginForm = document.querySelector('.form')
const mapBox = document.getElementById('map')
const logoutBtn = document.querySelector('.nav__el--loggout')

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.getAttribute('data-locations'))
  displayMap(locations)
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    login(email, password)
  })

if (logoutBtn)
  logoutBtn.addEventListener('click', e => {
    e.preventDefault()
    logout()
  })
