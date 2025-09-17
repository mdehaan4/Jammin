import React from 'react';
import Track from '../Track/Track';
import type { TrackType } from '../types';

type TracklistProps = {
  tracks: TrackType[];
  onAdd?: (track: TrackType) => void;
  onRemove?: (track: TrackType) => void;
  isRemoval: boolean;
};

const Tracklist: React.FC<TracklistProps> = ({ tracks, onAdd, onRemove, isRemoval }) => {
  return (
    <div className="Tracklist">
      {tracks.map(track => (
        <Track 
          key={track.id} 
          track={track} 
          onAdd={onAdd} 
          onRemove={onRemove} 
          isRemoval={isRemoval} 
        />
      ))}
    </div>
  );
};

export default Tracklist;
