'use strict'

import { removeInputValidations, validateUser, showAlert } from './utils.js'

document.addEventListener('DOMContentLoaded', () => {
  const addForm = document.getElementById('add-form')
  const inputs = addForm.getElementsByTagName('input')

  document.getElementById('add-form').addEventListener('submit', e => {
    e.preventDefault()

    // Store all user inputs
    let user = {}

    // Get all the values
    for (let input of inputs) {
      user[input.name] = input.value
    }

    // Validate user
    const errors = validateUser(user)

    // Shows input errors
    if (errors) {
      for (const key in errors) {
        const input = document.getElementsByName(key)[0]
        input.classList.add('is-invalid')
        console.log(key)
        console.log(input.nextElementSibling)
        // Display errors
        input.nextElementSibling.innerText = errors[key]
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users'))

      const lastId = users[users.length - 1].id

      const newUser = {
        id: lastId + 1,
        name: user.name,
        username: user.username,
        email: user.email,
        address: {
          street: user.street,
          suite: user.suite,
          city: user.city,
          zipcode: user.zipcode
        },
        phone: user.phone,
        website: user.website,
        company: {
          name: user.companyName,
          catchPhrase: user.companyCatchphrase,
          bs: user.companyBS
        }
      }

      // Add the new user
      localStorage.setItem('users', JSON.stringify([...users, newUser]))

      showAlert(`User (name: ${user.name}) was successfully added.`, 'success')

      // Clear all inputs
      for (let input of inputs) {
        input.value = ''
      }
    }
  })

  // Inputs keyup event listener that removes validation
  removeInputValidations(inputs)
})
