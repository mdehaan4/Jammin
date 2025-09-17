
import React, { useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import Playlist from './Playlist/Playlist';

import type { TrackType } from './types';
import { getAccessToken, savePlaylist, searchTracks, logoutSpotify, getSpotifyUserProfile } from './Spotify';

const initialSearchResults: TrackType[] = [
  { id: 1, name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b' },
  { id: 2, name: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', uri: 'spotify:track:463CkQjx2Zk1yXoBuierM9' },
  { id: 3, name: 'Peaches', artist: 'Justin Bieber', album: 'Justice', uri: 'spotify:track:4iJyoBOLtHqaGxP12qzhQI' }
];





const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<TrackType[]>(initialSearchResults);
  const [playlistName, setPlaylistName] = useState<string>('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState<TrackType[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  React.useEffect(() => {
    async function fetchEmail() {
      try {
        // Only try to get access token if one exists or if a code is present in the URL
        const token = localStorage.getItem('spotify_access_token');
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!token && !code) {
          setUserEmail(null);
          return;
        }
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        const profile = await getSpotifyUserProfile(accessToken);
        setUserEmail(profile.email || null);
      } catch (e) {
        setUserEmail(null);
      }
    }
    fetchEmail();
  }, []);

  // Add track to playlist
  const addTrack = (track: TrackType) => {
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
  };

  // Remove track from playlist
  const removeTrack = (track: TrackType) => {
    setPlaylistTracks(playlistTracks.filter(savedTrack => savedTrack.id !== track.id));
  };

  // Update playlist name
  const updatePlaylistName = (name: string) => {
    setPlaylistName(name);
  };

  // Search Spotify
  const handleSearch = async (term: string) => {
    const accessToken = await getAccessToken();
    if (!accessToken) return;
    const results = await searchTracks(term, accessToken);
    setSearchResults(results);
  };

  // Save playlist to Spotify
  const handleSavePlaylist = async () => {
    if (!playlistName || playlistTracks.length === 0) {
      alert('Please enter a playlist name and add at least one track.');
      return;
    }
    const accessToken = await getAccessToken();
    if (!accessToken) return;
    const uris = playlistTracks.map(track => track.uri);
    try {
      await savePlaylist(playlistName, uris, accessToken);
      alert('Playlist saved to Spotify!');
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
    } catch (e) {
      alert('Failed to save playlist: ' + (e instanceof Error ? e.message : e));
    }
  };

    return (
      <>
        <div className="top-right-controls">
          {/* Log in button if not logged in */}
          {!userEmail && (
            <button
              className="spotify-login-btn"
              onClick={() => {
                localStorage.removeItem('spotify_access_token');
                getAccessToken();
              }}
            >
              Log in with Spotify
            </button>
          )}
          {/* Log out button and email below it if logged in */}
          {userEmail && (
            <>
              <button
                className="spotify-logout-btn"
                onClick={logoutSpotify}
              >
                Log out
              </button>
              <div className="user-email">
                {userEmail}
              </div>
            </>
          )}
        </div>
        <div id="app-outer-box">
          <div className="App">
            <h1 className="sour-gummy-jammin">Jammin</h1>
            <h3>Create a cool playlist for your spotify.</h3>
            <SearchBar onSearch={handleSearch} />
            <div className="main-content">
              <div className="search-results-box">
                <SearchResults 
                  searchResults={searchResults} 
                  onAdd={addTrack} 
                  userEmail={userEmail}
                />
              </div>
              <div className="playlist-box">
                <Playlist 
                  playlistName={playlistName} 
                  playlistTracks={playlistTracks} 
                  onRemove={removeTrack} 
                  onNameChange={updatePlaylistName}
                  onSave={handleSavePlaylist}
                />
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default App;
