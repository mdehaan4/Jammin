
import React, { useState } from 'react';

type SearchBarProps = {
  onSearch: (term: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleSearch = () => {
    if (term.trim()) onSearch(term.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="SearchBar">
      <input
        id="main-search-input"
        placeholder="Enter A Song, Album, or Artist"
        value={term}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button id="main-search-button" onClick={handleSearch}>SEARCH</button>
    </div>
  );
};

export default SearchBar;
