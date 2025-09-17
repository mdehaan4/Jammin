import React from 'react';
import Tracklist from '../Tracklist/Tracklist';
import type { TrackType } from '../types';

type SearchResultsProps = {
  searchResults: TrackType[];
  onAdd: (track: TrackType) => void;
};



// We'll pass userEmail as a prop for simplicity
type PropsWithUser = SearchResultsProps & { userEmail: string | null };

const SearchResults: React.FC<PropsWithUser> = ({ searchResults, onAdd, userEmail }) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      {(!userEmail || userEmail === null) ? (
        <div className="search-login-message">
          Log in to Spotify to start song search!
        </div>
      ) : (
        <Tracklist tracks={searchResults} onAdd={onAdd} isRemoval={false} />
      )}
    </div>
  );
};

export default SearchResults;
