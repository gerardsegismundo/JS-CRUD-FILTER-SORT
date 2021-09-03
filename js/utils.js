'use strict'

function createUserCookie(userId) {
  const users = [...JSON.parse(localStorage.getItem('users'))]

  const user = users.find(user => user.id.toString() === userId)

  document.cookie = JSON.stringify(user)
}

function debounce(fn, ms) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

function fillOutInputs(inputs, user) {
  for (let i = 0; i < inputs.length; i++) {
    if (i > 2 && i < 7) {
      inputs[i].value = user.address[inputs[i].name]
    } else if (i > 8) {
      inputs[i].value = Object.values(user.company)[i - 9]
    } else {
      inputs[i].value = user[inputs[i].name]
    }
  }
}

function removeInputValidations(inputs) {
  for (let input of inputs) {
    input.addEventListener('keyup', () => {
      if (input.classList.contains('is-invalid')) {
        input.classList.remove('is-invalid')
        input.nextElementSibling.classList.remove('is-invalid')
        input.nextElementSibling.innerText = ''
      }
    })
  }
}

function validateUser(user) {
  const { id = null, name, username, email, street, zipcode, city, phone } = user
  const users = JSON.parse(localStorage.getItem('users'))

  const validateEmail = email => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    return re.test(email)
  }

  let errors = {}

  // Checks username and email if already exists
  users.filter(user => {
    // For edit user to not compare username and email to itself.
    if (user.id !== id) {
      if (user.username === username) {
        errors.username = 'Username already exists.'
      }

      if (user.email === email) {
        errors.email = 'Email already exists.'
      }
    }
  })

  if (!email) {
    errors.email = 'Email is required.'
  } else {
    if (!validateEmail(email)) errors.email = 'Invalid email.'
  }

  if (!phone) errors.phone = 'Phone is required.'
  if (!name) errors.name = 'Name is required.'
  if (!username) errors.username = 'Username is required.'
  if (!street) errors.street = 'Address street is required.'
  if (!zipcode) errors.zipcode = 'Zipcode is required.'
  if (!city) errors.city = 'City is required.'

  return Object.keys(errors).length === 0 ? false : errors
}

function showAlert(message, className) {
  const div = document.createElement('div')
  div.className = `alert alert-${className} mt-4`

  const icon = className === 'success' ? "<i class='fa fa-check'></i>" : "<i class='fa fa-times'></i>"

  div.innerHTML = `${message}&nbsp;&nbsp;&nbsp;${icon}`

  const container = document.querySelector('.container')
  const form = document.querySelector('form')

  if (!form) {
    const table = document.querySelector('table')
    container.insertBefore(div, table)
  } else {
    container.insertBefore(div, form)
  }

  // Vanish in 3 seconds
  setTimeout(() => document.querySelector('.alert').remove(), 3000)
}

export { createUserCookie, debounce, removeInputValidations, validateUser, fillOutInputs, showAlert }
