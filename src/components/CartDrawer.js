import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';

function CartDrawer({ isOpen, onClose }) {
  const { cart, calculateSubtotal, calculateGST, calculateTotal, clearCart } = useCart();

  const subtotal = calculateSubtotal();
  const gst = calculateGST();
  const total = calculateTotal();

  return (
    <>
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <h2>🛒 Your Cart</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Items Container */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">📚</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: '12px', color: '#bbb', marginTop: '8px' }}>
                Add some books to get started!
              </p>
            </div>
          ) : (
            <div>
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="summary-row">
              <span className="summary-label">Subtotal:</span>
              <span className="summary-value">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row gst">
              <span className="summary-label">GST (18%):</span>
              <span className="summary-value">₹{gst.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span className="summary-label">Total:</span>
              <span className="summary-value">₹{total.toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => {
                alert(`Order Confirmed! Total: ₹${total.toFixed(2)}`);
                clearCart();
                onClose();
              }}
            >
              Checkout (₹{total.toFixed(2)})
            </button>
            <button 
              className="checkout-btn"
              style={{
                background: '#e0e0e0',
                color: '#333',
                marginTop: '8px'
              }}
              onClick={() => {
                clearCart();
                onClose();
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
