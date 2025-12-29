import React from 'react';

function CategoryFilter({ value, onChange }) {
  const categories = [
    'all',
    'Fiction',
    'Fantasy',
    'Romance',
    'Children',
    'Poetry'
  ];

  return (
    <div className="category-filter">
      <label htmlFor="category">📂 Category</label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Categories</option>
        {categories.filter(cat => cat !== 'all').map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
