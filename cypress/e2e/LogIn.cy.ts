describe('template spec', () => {
  it('Carga la página', () => {
    cy.visit("http://localhost:5173/")
  })
  it('Verifica que el botón de "Usuario" esté visible y tenga el texto correcto', () => {
    cy.visit("http://localhost:5173/")
    cy.get('[data-testid="sign-up-button"]').should('be.visible').and('have.text', 'Usuario');
  })
  
})