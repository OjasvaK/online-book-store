import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PaymentButton.css';

/**
 * PaymentButton Component
 * 
 * A React component that handles Razorpay payment integration
 * Manages the complete payment flow:
 * 1. Creates an order on backend
 * 2. Opens Razorpay checkout modal
 * 3. Handles payment response
 * 4. Verifies payment signature on backend
 */
const PaymentButton = ({ amount = 50000, onPaymentSuccess, onPaymentFailure }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  // Backend API URL (adjust based on your setup)
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  /**
   * Load Razorpay script dynamically
   * Returns a promise that resolves when script is loaded
   */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  /**
   * Handle payment button click
   * Initiates the payment process
   */
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setMessage('');

      // Step 1: Check if Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay. Please check your internet connection.');
      }

      // Step 2: Create order on backend
      setMessage('Creating order...');
      const orderResponse = await fetch(`${BACKEND_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Amount in paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const orderId = orderData.order.id;

      // Step 3: Open Razorpay checkout modal
      setMessage('Opening payment gateway...');
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        order_id: orderId,
        amount: amount,
        currency: 'INR',
        name: 'Online Book Store',
        description: 'Payment for Books',
        image: 'https://via.placeholder.com/100', // Your logo URL
        handler: async (response) => {
          await handlePaymentSuccess(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            handlePaymentFailure('Payment cancelled by user');
          },
        },
      };

      // Step 4: Show Razorpay checkout modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      handlePaymentFailure(error.message || 'An error occurred during payment');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle successful payment response
   * Verifies payment signature on backend
   */
  const handlePaymentSuccess = async (response) => {
    try {
      setMessage('Verifying payment...');
      setMessageType('info');

      // Step 1: Send payment details to backend for verification
      const verifyResponse = await fetch(`${BACKEND_URL}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // Payment verified successfully
        const successMessage = '✓ Payment successful! Thank you for your purchase.';
        setMessage(successMessage);
        setMessageType('success');

        // Call success callback if provided
        if (onPaymentSuccess) {
          onPaymentSuccess(response);
        }

        // Store payment details (optional)
        console.log('Payment verified:', verifyData.paymentDetails);
      } else {
        // Verification failed
        throw new Error(verifyData.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      handlePaymentFailure(error.message || 'Payment verification failed');
    }
  };

  /**
   * Handle payment failure
   */
  const handlePaymentFailure = (errorMessage) => {
    const failureMessage = `✗ Payment failed: ${errorMessage}`;
    setMessage(failureMessage);
    setMessageType('error');

    // Call failure callback if provided
    if (onPaymentFailure) {
      onPaymentFailure(errorMessage);
    }

    console.error('Payment failure:', errorMessage);
  };

  // Convert amount from paise to rupees for display
  const amountInRupees = (amount / 100).toFixed(2);

  return (
    <div className="payment-button-container">
      <button
        className="payment-button"
        onClick={handlePayment}
        disabled={isLoading}
        aria-label="Proceed to payment"
      >
        {isLoading ? 'Processing...' : `Pay ₹${amountInRupees}`}
      </button>

      {/* Display message feedback */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      {/* Additional info message */}
      <p className="payment-info">
        Secure payment powered by Razorpay
      </p>
    </div>
  );
};

// PropTypes for type safety
PaymentButton.propTypes = {
  amount: PropTypes.number, // Amount in paise (e.g., 50000 for ₹500)
  onPaymentSuccess: PropTypes.func, // Callback when payment succeeds
  onPaymentFailure: PropTypes.func, // Callback when payment fails
};

PaymentButton.defaultProps = {
  amount: 50000, // ₹500 by default
  onPaymentSuccess: null,
  onPaymentFailure: null,
};

export default PaymentButton;
