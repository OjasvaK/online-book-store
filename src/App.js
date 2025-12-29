import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import BookList from './components/BookList';
import CartDrawer from './components/CartDrawer';
import { useCart } from './context/CartContext';

function App() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all'
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  const handleSearchChange = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFilters(prev => ({
      ...prev,
      category: value
    }));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">📚 BookStore</h1>
          <div className="header-right">
            <button 
              className="cart-button"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              🛒 Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Filters Section - State Lifting */}
        <div className="filters-section">
          <SearchBar 
            value={filters.search} 
            onChange={handleSearchChange}
          />
          <CategoryFilter 
            value={filters.category} 
            onChange={handleCategoryChange}
          />
        </div>

        {/* Book List */}
        <BookList filters={filters} />
      </main>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
      />

      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="overlay active" 
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;
