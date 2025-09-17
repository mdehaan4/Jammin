import React from 'react';
import type { TrackType } from '../types';

type TrackProps = {
  track: TrackType;
  onAdd?: (track: TrackType) => void;
  onRemove?: (track: TrackType) => void;
  isRemoval: boolean;
};

const Track: React.FC<TrackProps> = ({ track, onAdd, onRemove, isRemoval }) => {
  const addTrack = () => onAdd && onAdd(track);
  const removeTrack = () => onRemove && onRemove(track);

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      {isRemoval ? (
        <button className="Track-action" onClick={removeTrack}>-</button>
      ) : (
        <button className="Track-action" onClick={addTrack}>+</button>
      )}
    </div>
  );
};

export default Track;
