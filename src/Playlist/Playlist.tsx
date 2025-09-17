import React from 'react';
import './Playlist.css';
import Tracklist from '../Tracklist/Tracklist';
import type { TrackType } from '../types';


type PlaylistProps = {
  playlistName: string;
  playlistTracks: TrackType[];
  onRemove: (track: TrackType) => void;
  onNameChange: (name: string) => void;
  onSave: () => void;
};


const Playlist: React.FC<PlaylistProps> = ({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
  };

  return (
    <div className="Playlist">
      <input className="playlist-name-input" value={playlistName} onChange={handleNameChange} />
      <Tracklist tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button className="Playlist-save" onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
};

export default Playlist;
