import React from 'react';

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="search">🔍 Search Books</label>
      <input
        id="search"
        type="text"
        placeholder="Search by title or author..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
