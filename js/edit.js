'use strict'

import { validateUser, removeInputValidations, fillOutInputs, showAlert } from './utils.js'

const editForm = document.getElementById('edit-form')
const user = JSON.parse(document.cookie)
const inputs = editForm.getElementsByTagName('input')

document.addEventListener('DOMContentLoaded', () => {
  // Displays user id
  document.getElementById('edit-user-id').innerText = `ID: ${user.id}`

  // Fill out inputs with the corresponding values from the user
  fillOutInputs(inputs, user)

  // Inputs keyup event listener that removes validation
  removeInputValidations(inputs)

  // Edit user
  editForm.addEventListener('submit', e => {
    e.preventDefault()

    // Store all user inputs
    let userInputs = { id: user.id }

    // Get all the user input values
    for (let input of inputs) {
      userInputs[input.name] = input.value
    }

    // Validate user
    const errors = validateUser(userInputs)

    // Shows input errors
    if (errors) {
      for (const key in errors) {
        const input = document.getElementsByName(key)[0]
        input.classList.add('is-invalid')

        input.nextElementSibling.innerText = errors[key]
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users'))

      const editedUser = {
        id: userInputs.id,
        name: userInputs.name,
        username: userInputs.username,
        email: userInputs.email,
        address: {
          street: userInputs.street,
          suite: userInputs.suite,
          city: userInputs.city,
          zipcode: userInputs.zipcode
        },
        phone: userInputs.phone,
        website: userInputs.website,
        company: {
          name: userInputs.companyName,
          catchPhrase: userInputs.companyCatchphrase,
          bs: userInputs.companyBS
        }
      }

      // Find the user index to be edited
      const userIndex = users.findIndex(({ id }) => id === user.id)

      // Edit that user
      users[userIndex] = editedUser

      // Save changes
      localStorage.setItem('users', JSON.stringify(users))

      showAlert(`User (id: ${editedUser.id}) was successfully edited.`, 'success')
    }
  })
})
