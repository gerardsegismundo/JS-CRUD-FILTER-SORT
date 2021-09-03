'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(document.cookie)

  document.getElementById('view-user-id').innerText = `ID: ${user.id}`

  const userInfoEl = document.getElementById('user-info')

  userInfoEl.innerHTML = `     
    <div class="row mt-5">
      <div class="col-xs-12 col-md-3">
        <label class="bg-light px-1">Name</label>
        <p>${user.name}</p>
      </div>
      <div class="col-xs-12 col-md-3">
        <label class="bg-light px-1">Username</label>
        <p>${user.username}</p>
      </div>
      <div class="col-xs-12 col-md-3">
        <label class="bg-light px-1">Email</label>
        <p>${user.email}</p>
      </div>
    </div>
    
    <label class="mt-4 bg-light px-1">Address</label>
    <p>${user.address.street}, ${user.address.suite ? user.address.suite + ', ' : ''}${user.address.city}, ${
    user.address.zipcode
  }</p>

    <div class="row mt-5">
      <div class="col-xs-12 col-md-3">
        <label class="bg-light px-1">Phone</label>
        <p>${user.phone}</p>
      </div>
      <div class="col-3">
        <label class="bg-light px-1">Website</label>
        <p>${user.website}</p>
      </div>
    </div>

    <div class="row my-5">
      <div class="col">
        <label class="bg-light px-1">Company</label>
        <p>${user.company.name}</p>
        <span class="font-weight-light">"${user.company.catchPhrase}"</span>
        <br>
        <span class="font-weight-light font-italic">- ${user.company.bs}</span>
      </div>
    </div> 
  `
})
