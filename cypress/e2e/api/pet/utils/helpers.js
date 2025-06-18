export const deletePetAndVerifyIsDeleted = (path, id) =>
  cy.deletePet(path, id).then((response) => {
    expect(response.status).to.equal(200)
    cy.findPetById(path, id).then((response) => {
      expect(response.body.message).to.have.property('message', 'Pet not found')
    })
  })

export const getRandomId = () => Math.round(Math.random() * 10000000000)
