import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';

// ==================== API BASE CONFIGURATION ====================
// Production API URL from environment variable
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function CartDrawer({ isOpen, onClose }) 
{
  const { cart, calculateSubtotal, calculateGST, calculateTotal, clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Load Razorpay script dynamically from CDN
   * Required for Razorpay checkout modal
   */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (window.Razorpay) {
        console.log('✓ Razorpay script already loaded');
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.type = 'text/javascript';
      script.onload = () => {
        console.log('✓ Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('✗ Failed to load Razorpay script from CDN');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  /**
   * Create order on backend
   * Calls POST /create-order endpoint
   */
  const createOrder = async (amount) => {
    try {
      console.log('📦 Creating order with amount:', amount, 'paise');

      const response = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }

      const orderData = await response.json();
      console.log('✓ Order created:', orderData);

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      return orderData.order;
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      throw error;
    }
  };

  /**
   * Verify payment signature
   * Calls POST /verify-payment endpoint
   */
  const verifyPayment = async (paymentResponse) => {
    try {
      console.log('🔍 Verifying payment signature...');

      const response = await fetch(`${API_BASE}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Verification error:', errorText);
        throw new Error(`Verification failed: ${errorText}`);
      }

      const verifyData = await response.json();
      console.log('✓ Verification response:', verifyData);

      if (!verifyData.success) {
        throw new Error(verifyData.message || 'Payment verification failed');
      }

      return verifyData;
    } catch (error) {
      console.error('❌ Verification failed:', error);
      throw error;
    }
  };

  /**
   * Main payment handler
   * Orchestrates: load script → create order → open checkout → verify payment
   */
  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentStatus(null);

      console.log('🔐 Initiating payment process...');
      console.log('API Base URL:', API_BASE);

      const subtotal = calculateSubtotal();
      const gst = calculateGST();
      const total = calculateTotal();

      // Step 1: Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay checkout script. Please check your internet connection.');
      }

      // Step 2: Create order on backend
      const order = await createOrder(total * 100); // Convert to paise
      const orderId = order.id;

      // Step 3: Open Razorpay checkout modal
      console.log('💳 Opening Razorpay checkout...');
      const razorpayOptions = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        order_id: orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'Online Book Store',
        description: 'Purchase Books',
        handler: async (paymentResponse) => {
          try {
            console.log('✓ Payment completed by Razorpay');
            console.log('Payment response:', {
              orderId: paymentResponse.razorpay_order_id,
              paymentId: paymentResponse.razorpay_payment_id,
            });

            // Step 4: Verify payment on backend
            const verifyResult = await verifyPayment(paymentResponse);

            // Step 5: Payment successful
            console.log('✓✓ Payment verified successfully!');
            setPaymentStatus({
              type: 'success',
              message: `✓ Payment successful! Order ID: ${paymentResponse.razorpay_order_id}`,
            });

            clearCart();

            // Close drawer after 3 seconds
            setTimeout(() => {
              onClose();
              setPaymentStatus(null);
            }, 3000);
          } catch (error) {
            console.error('❌ Payment verification failed:', error);
            setPaymentStatus({
              type: 'error',
              message: `✗ Verification failed: ${error.message}`,
            });
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            console.log('User closed Razorpay modal');
            setPaymentStatus({
              type: 'error',
              message: '⚠️ Payment cancelled by user',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      console.error('❌ Payment error:', error);
      setPaymentStatus({
        type: 'error',
        message: `✗ Payment failed: ${error.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ==================== RENDER ====================
  const subtotal = calculateSubtotal();
  const gst = calculateGST();
  const total = calculateTotal();

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Shopping Cart</h2>
          <button className="drawer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="price-details">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>GST (18%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {paymentStatus && (
              <div className={`payment-status ${paymentStatus.type}`}>
                {paymentStatus.message}
              </div>
            )}

            <button
              className="checkout-btn"
              onClick={handleRazorpayPayment}
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;

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
      {cart.length > 0 && 
      (
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
          {paymentStatus && 
          (
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


export default CartDrawer;
