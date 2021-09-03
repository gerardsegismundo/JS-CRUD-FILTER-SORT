'use strict'

import { debounce, createUserCookie, showAlert } from './utils.js'

class UI {
  static async displayUsers() {
    let users

    if (!localStorage.users) {
      users = await API.fetchUsers()
    } else {
      users = JSON.parse(localStorage.getItem('users'))
    }

    users.map(user => {
      const list = document.getElementById('user-list')

      const row = document.createElement('tr')
      row.setAttribute('data-is-visible', 'true')

      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td class='td-btn-group'>
          <button value="submit" id="view-${user.id}" class="btn btn-outline-info view-btn">
            <i class="fa fa-eye"></i>
          </button>
          <button id="edit-${user.id}" class="btn btn-outline-warning edit-btn">
            <i class="fa fa-pencil"></i>
          </button>
          <button id="delete-${user.id}" class="btn btn-outline-danger delete-btn">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      `

      list.appendChild(row)
    })
  }

  static viewUser(targetId) {
    const userIdV = targetId.replace('view-', '')
    createUserCookie(userIdV)
    window.location.href = '/user.html'
  }

  static editUser(targetId) {
    const userIdE = targetId.replace('edit-', '')
    createUserCookie(userIdE)
    window.location.href = '/edit.html'
  }

  static async deleteUser(elId, userId) {
    document.getElementById(elId).parentElement.parentElement.remove()
    showAlert(`User (id:${userId}) was successfully deleted.`, 'success')
  }

  static sortUsers(e) {
    const sortBy = e.target.value

    let tr = document.getElementById('user-table').rows
    let switching = true

    while (switching) {
      switching = false

      let i, shouldSwitch

      for (i = 1; i < tr.length - 1; i++) {
        shouldSwitch = false

        // Changes the row to dynamically get the right text content
        let rowIndex = sortBy === 'id' ? 0 : sortBy === 'name' ? 1 : sortBy === 'username' ? 2 : 3

        /* Get the two elements you want to compare,
      one from current row and one from the next: */
        let row1 = tr[i].getElementsByTagName('TD')[rowIndex]
        let row2 = tr[i + 1].getElementsByTagName('TD')[rowIndex]

        /* If sortby Id sort numerically else sort alphabetically
         And check if the two tr should switch place */
        if (
          sortBy === 'id'
            ? parseFloat(row1.textContent) > parseFloat(row2.textContent)
            : row1.textContent.toLowerCase() > row2.textContent.toLowerCase()
        ) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true
          break
        }
      }

      if (shouldSwitch) {
        /* If a switch has been marked,
        make the switch and mark that a switch has been done: */
        tr[i].parentNode.insertBefore(tr[i + 1], tr[i])
        switching = true
      }
    }
  }

  static searchUser(e) {
    debounce(() => {
      const text = e.target.value

      if (typeof text !== 'string') return

      const tr = document.getElementById('user-table').rows

      let matches = []

      for (let i = 0; i < tr.length; i++) {
        let tdArr = tr[i].querySelectorAll('td')

        tdArr.forEach(td => {
          if (typeof td.textContent !== 'string') return

          const regex = new RegExp(`${text}`, 'gi')

          // If match
          if (regex.test(td.textContent)) return matches.push(td.parentElement)

          td.parentElement.setAttribute('data-is-visible', 'false')
        })
      }

      // Remove duplicates
      matches = [...new Set(matches)]

      // Shows matches rows (filtered)
      matches.map(tr => tr.setAttribute('data-is-visible', 'true'))
    }, 1000)()
  }
}

class API {
  static async fetchUsers() {
    try {
      const users = await (await fetch('https://jsonplaceholder.typicode.com/users')).json()

      localStorage.setItem('users', JSON.stringify(users))
      return users
    } catch (error) {
      // DO LATER - display error
      console.log('error')
      return false
    }
  }

  static async deleteUser(userId) {
    try {
      // Resource will not be really updated on the server but it will be faked as if.
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'DELETE'
      })

      console.log(response)

      let users = JSON.parse(localStorage.getItem('users'))

      users = users.filter(({ id }) => id !== parseInt(userId))
      localStorage.setItem('users', JSON.stringify(users))
    } catch (error) {
      console.error(error)
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Display Users
  UI.displayUsers()

  // Sort Users Table
  document.getElementById('select-sort').addEventListener('change', e => UI.sortUsers(e))

  // Search Users
  document.getElementById('search-box').addEventListener('keyup', e => UI.searchUser(e))

  // Table Events: View, Edit, Delete
  document.getElementById('user-list').addEventListener('click', e => {
    const targetId = e.target.id
    const contains = btnClass => e.target.classList.contains(btnClass)

    if (contains('view-btn')) {
      UI.viewUser(targetId)
    }

    if (contains('edit-btn')) {
      UI.editUser(targetId)
    }
    // Delete user
    if (contains('delete-btn')) {
      const userId = targetId.replace('delete-', '')

      const confirmDelete = confirm(`Are you sure you want to delete user #${userId}`)

      if (confirmDelete) {
        UI.deleteUser(targetId, userId)
        API.deleteUser(userId)
      }
    }
  })
})
