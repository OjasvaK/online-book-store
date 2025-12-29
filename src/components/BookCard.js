import React from 'react';
import { useCart } from '../context/CartContext';

function BookCard({ book }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  
  const cartItem = cart.find(item => item.id === book.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(book);
  };

  const handleIncrement = () => {
    updateQuantity(book.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(book.id, quantity - 1);
    } else {
      removeFromCart(book.id);
    }
  };

  return (
    <div className="book-card">
      <div className="book-cover">
        <div style={{ wordWrap: 'break-word', lineHeight: '1.5' }}>
          {book.title}
        </div>
      </div>
      
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <span className="book-category">{book.category}</span>
        <p className="book-price">₹{book.price}</p>
        
        <div className="book-actions">
          {quantity === 0 ? (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          ) : (
            <div className="quantity-control">
              <button className="qty-btn" onClick={handleDecrement}>−</button>
              <div className="qty-display">{quantity}</div>
              <button className="qty-btn" onClick={handleIncrement}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
