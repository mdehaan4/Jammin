// Fetch the current Spotify user's profile (including email)
export async function getSpotifyUserProfile(accessToken: string) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return await response.json();
}
// Log out the Spotify user by clearing tokens and reloading
export function logoutSpotify() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_code_verifier');
  window.location.reload();
}
// src/Spotify.ts
// Handles Spotify authentication and API requests using PKCE and the new redirect URI rules

const clientId = '6eb953900ba04870840625c591dc156b'; // Replace with your Spotify app client ID
const redirectUri = 'https://jamminsongs.netlify.app/callback'; // Must match Spotify dashboard
const scopes = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email',
];

function generateRandomString(length: number) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function base64encode(str: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return base64encode(digest);
}

export async function getAccessToken() {
  let accessToken = localStorage.getItem('spotify_access_token');
  if (accessToken) return accessToken;

  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) {
    // Start auth flow
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem('spotify_code_verifier', codeVerifier);
    const state = generateRandomString(16);
    const authUrl =
      'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scopes.join(' '),
        redirect_uri: redirectUri,
        state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
      });
    window.location.href = authUrl;
    return;
  }

  // Exchange code for token
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) throw new Error('Missing code verifier');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('spotify_access_token', data.access_token);
    window.history.replaceState({}, document.title, '/');
    return data.access_token;
  } else {
    throw new Error('Failed to get access token: ' + JSON.stringify(data));
  }
}

export async function searchTracks(term: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  if (!data.tracks || !data.tracks.items) return [];
  return data.tracks.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    artist: item.artists[0]?.name || '',
    album: item.album?.name || '',
    uri: item.uri,
  }));
}

export async function savePlaylist(name: string, uris: string[], accessToken: string) {
  // Get user ID
  const userRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const userData = await userRes.json();
  const userId = userData.id;
  if (!userId) throw new Error('Could not get user ID');

  // Create playlist
  const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, public: false }),
  });
  const playlistData = await playlistRes.json();
  const playlistId = playlistData.id;
  if (!playlistId) throw new Error('Could not create playlist');

  // Add tracks
  const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris }),
  });
  if (!addTracksRes.ok) throw new Error('Could not add tracks to playlist');
  return playlistId;
}
