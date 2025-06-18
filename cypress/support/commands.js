// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-ajv-schema-validator'

Cypress.Commands.add('addPet', ({ path, method, headers, body }) => {
  cy.request({
    failOnStatusCode: false,
    method: method,
    url: path,
    headers: headers,
    body: body
  })
})

Cypress.Commands.add('updatePet', ({ path, method, headers, body }) => {
  cy.request({
    failOnStatusCode: false,
    method: method,
    url: path,
    headers: headers,
    body: body
  })
})

Cypress.Commands.add('findPetById', (path, id) => {
  cy.request({
    failOnStatusCode: false,
    method: 'GET',
    url: `${path}/${id}`,
    headers: { accept: 'application/json' }
  })
})

Cypress.Commands.add('deletePet', (path, id) => {
  cy.request({
    failOnStatusCode: false,
    method: 'DELETE',
    url: `${path}/${id}`,
    headers: { accept: 'application/json' }
  })
})
