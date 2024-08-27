describe('Verify reports', () => {
  it('fails the test for reports 1', () => {
    expect(Cypress.config().baseUrl).to.include('/reports_1')
  })
})
