import React from 'react';
import BookCard from './BookCard';
import books from '../data/books';

function BookList({ filters }) {
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      book.author.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = 
      filters.category === 'all' || book.category === filters.category;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {filteredBooks.length > 0 ? (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">📭</div>
          <div className="no-results-text">
            No books found matching your search
          </div>
          <p style={{ fontSize: '14px', marginTop: '8px', color: '#bbb' }}>
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}

export default BookList;
