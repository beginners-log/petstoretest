describe('Verify reports', () => {
  it('fails the test for reports 2', () => {
    expect(Cypress.config().baseUrl).to.include('/reports_2')
  })
  it('passes the test for reports 2', () => {
    expect(Cypress.config().baseUrl).to.not.include('/reports_2')
  })
})
