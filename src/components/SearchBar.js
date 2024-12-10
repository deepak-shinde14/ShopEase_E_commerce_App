import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('recentSearches')) || []
  );

  const handleSearch = (query) => {
    onSearch(query);
    const updatedSearches = [query, ...recentSearches.filter((q) => q !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  return (
    <div className="w-full flex flex-col items-center my-4">
      <input
        type="text"
        className="p-2 border rounded w-1/2"
        placeholder="Search products..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {recentSearches.length > 0 && (
        <div className="mt-2 w-1/2 text-left">
          <p className="text-gray-600 mb-1">Recent Searches:</p>
          <ul className="list-disc list-inside">
            {recentSearches.map((search, index) => (
              <li
                key={index}
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() => handleSearch(search)}
              >
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
