//filtersidebar.js
import React from 'react';

const FilterSidebar = ({ categories, selectedCategory, onFilter }) => {
    return (
      <aside className="w-1/4 bg-white p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onFilter(category)}
            className={`w-full text-left px-4 py-2 mb-2 rounded ${
              selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100'
            } hover:bg-primary hover:text-white`}
          >
            {category}
          </button>
        ))}
      </aside>
    );
  };
  

export default FilterSidebar;
