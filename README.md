# Jammin - Spotify Playlist Creator

A modern React + TypeScript + Vite app for searching Spotify, building playlists, and saving them to your Spotify account.

## Features
- Spotify authentication (PKCE flow)
- Search for tracks using the Spotify API
- Build and edit custom playlists
- Save playlists directly to your Spotify account
- Responsive, clean UI with modular CSS
- End-to-end tests with Cypress

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Spotify Developer account ([Spotify Dashboard](https://developer.spotify.com/dashboard))

### Setup
1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd Jammin2
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure Spotify App:**
   - Set your Spotify app's Redirect URI to `http://127.0.0.1:5173/callback` in the Spotify Developer Dashboard.
   - Update `clientId` and `redirectUri` in `src/Spotify.ts` if needed.

### Running the App
```sh
npm run dev -- --host
```
Visit [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

## Testing

This project uses **Cypress** for testing. Cypress tests simulate real user interactions and verify that the app's UI and flows work as expected.

### What the tests cover
- The Jammin title and branding are visible
- The login button appears when logged out
- The search bar, playlist box, and search results box are visible
- The message "Log in to Spotify to start song search" appears when not logged in

You can add more tests for searching, playlist creation, and saving as needed.

### How to run Cypress tests
1. Start the dev server: `npm run dev -- --host`
2. In another terminal:
   ```sh
   npx cypress open
   ```
3. Select a test file in the Cypress UI to run tests.

## Building for Production
```sh
npm run build
```
The production-ready files will be in the `dist/` folder.

## Deployment
- Deploy the `dist/` folder to your preferred static hosting (Vercel, Netlify, GitHub Pages, etc.).
- Make sure your Spotify app's Redirect URI matches your deployed URL.

## Project Structure
- `src/` - React components, CSS, and app logic
- `cypress/` - Cypress E2E tests and support files
- `public/` - Static assets and `index.html`

## License
MIT
