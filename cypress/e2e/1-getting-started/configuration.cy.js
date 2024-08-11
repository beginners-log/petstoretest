describe('Verify configuration', () => {
  it('checks linter rules are applied', () => {
    let i
    cy.wait(400)
    console.log(Cypress.env())
  })

  it('checks the respective environment is applied', () => {
    const user = Cypress.env().user_1

    expect(Cypress.config().baseUrl).to.include('/dev')
    expect(user).to.eq('development user')
  })
})
