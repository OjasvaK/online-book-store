import React from 'react';
import { useCart } from '../context/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-title">{item.title}</div>
        <div className="cart-item-author">{item.author}</div>
        <div className="cart-item-price">
          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
        </div>
      </div>
      
      <div className="cart-item-actions">
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            style={{ padding: '4px 6px', minWidth: '24px' }}
          >
            −
          </button>
          <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '600' }}>
            {item.quantity}
          </span>
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            style={{ padding: '4px 6px', minWidth: '24px' }}
          >
            +
          </button>
        </div>
        <button
          className="remove-btn"
          onClick={() => removeFromCart(item.id)}
          title="Remove from cart"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default CartItem;
