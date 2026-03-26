import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';

function CartDrawer({ isOpen, onClose }) {
  const { cart, calculateSubtotal, calculateGST, calculateTotal, clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentStatus(null);

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay');
      }

      // Create order on backend
      const orderResponse = await fetch(`${BACKEND_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.message || 'Failed to create order');

      // Open Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        order_id: orderData.order.id,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Online Book Store',
        description: 'Purchase Books',
        handler: async (response) => {
          // Verify payment on backend
          const verifyResponse = await fetch(`${BACKEND_URL}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            setPaymentStatus({
              type: 'success',
              message: `✓ Payment successful! Order ID: ${response.razorpay_order_id}`,
            });
            clearCart();
            setTimeout(() => {
              onClose();
              setPaymentStatus(null);
            }, 3000);
          } else {
            throw new Error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: { color: '#3399cc' },
        modal: {
          ondismiss: () => {
            setPaymentStatus({
              type: 'error',
              message: 'Payment cancelled by user',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setPaymentStatus({
        type: 'error',
        message: `✗ Payment failed: ${error.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

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

            {/* Payment Status Message */}
            {paymentStatus && (
              <div style={{
                padding: '12px',
                marginBottom: '12px',
                borderRadius: '6px',
                backgroundColor: paymentStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                color: paymentStatus.type === 'success' ? '#155724' : '#721c24',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                border: `1px solid ${paymentStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
              }}>
                {paymentStatus.message}
              </div>
            )}

            <button 
              className="checkout-btn"
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Checkout (₹${total.toFixed(2)})`}
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
