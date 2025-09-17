describe('Jammin App', () => {
  it('shows the Jammin title', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.contains('Jammin').should('be.visible');
  });

  it('shows login button when logged out', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.contains('Log in with Spotify').should('be.visible');
  });

  it('shows login prompt in search results when logged out', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.contains('Log in to Spotify to start song search').should('be.visible');
  });

  it('shows the log in to Spotify message when user is not logged in', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.contains('Log in to Spotify to start song search').should('be.visible');
  });
});