/* eslint-disable */
import '@babel/polyfill'
import { login, logout } from './logged'
import { displayMap } from './mapbox'
import { updateData } from './updateSettings'

// DOM ELEMENTS
const loginForm = document.querySelector('.form.form--login')
const mapBox = document.getElementById('map')
const logoutBtn = document.querySelector('.nav__el--loggout')
const userDataForm = document.querySelector('.form-user-data')

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

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault()
    const name = document.querySelector('#name').value
    const email = document.querySelector('#email').value
    updateData(name, email)
  })
