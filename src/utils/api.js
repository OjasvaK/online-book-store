/**
 * API Configuration and Helpers
 * Centralized API base URL and helper functions for all backend calls
 * 
 * Environment Variables:
 * - REACT_APP_BACKEND_URL: Production backend URL (e.g., https://online-book-store-ce1n.onrender.com)
 * - REACT_APP_RAZORPAY_KEY_ID: Razorpay live public key
 */

// ==================== API BASE CONFIGURATION ====================
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

/**
 * Payment API endpoints
 * All functions throw errors on failure, allowing caller to handle
 */
export const paymentAPI = {
  /**
   * Create order on backend
   * @param {number} amount - Amount in rupees (will be converted to paise)
   * @param {string} currency - Currency code (default: 'INR')
   * @returns {Promise<{success: boolean, order: {id, amount, currency, status}}>}
   */
  createOrder: async (amount, currency = 'INR') => {
    try {
      console.log('📦 Creating order:', { amount, currency });

      const response = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount), // Amount in paise
          currency,
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✓ Order created successfully:', data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      return data.order;
    } catch (error) {
      console.error('❌ Order creation error:', error);
      throw error;
    }
  },

  /**
   * Verify payment signature
   * @param {string} razorpay_order_id - Order ID from Razorpay
   * @param {string} razorpay_payment_id - Payment ID from Razorpay
   * @param {string} razorpay_signature - Signature from Razorpay
   * @returns {Promise<{success: boolean, message: string, paymentDetails: object}>}
   */
  verifyPayment: async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    try {
      console.log('🔍 Verifying payment:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });

      const response = await fetch(`${API_BASE}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Verification error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✓ Payment verified:', data);

      if (!data.success) {
        throw new Error(data.message || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('❌ Verification error:', error);
      throw error;
    }
  },
};

/**
 * Other API endpoints can be added here
 * For example: booksAPI, categoryAPI, searchAPI, etc.
 */

// Export API_BASE for debugging or advanced usage
export { API_BASE };
