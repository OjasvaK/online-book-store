/**
 * INTEGRATION EXAMPLES - PaymentButton Component
 * 
 * This file contains example implementations showing various ways
 * to integrate the PaymentButton component in your React application.
 * 
 * Copy and modify these examples for your needs.
 */

// ============================================================
// EXAMPLE 1: Basic Integration (Recommended for Start)
// ============================================================

import React from 'react';
import PaymentButton from './components/PaymentButton';

function BasicExample() {
  const handleSuccess = (response) => {
    console.log('Payment Success:', response);
    alert('Payment successful! Order ID: ' + response.razorpay_order_id);
  };

  const handleFailure = (error) => {
    console.log('Payment Failed:', error);
    alert('Payment failed: ' + error);
  };

  return (
    <div>
      <h1>Book Store Checkout</h1>
      <PaymentButton
        amount={50000}  // ₹500
        onPaymentSuccess={handleSuccess}
        onPaymentFailure={handleFailure}
      />
    </div>
  );
}

// ============================================================
// EXAMPLE 2: Dynamic Amount from Cart
// ============================================================

import React, { useState } from 'react';

function CartCheckout() {
  const [cartItems] = useState([
    { id: 1, name: 'Book 1', price: 250, quantity: 2 },
    { id: 2, name: 'Book 2', price: 350, quantity: 1 },
  ]);

  // Calculate total in paise
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ) * 100;

  const handlePaymentSuccess = async (response) => {
    try {
      // Save order to database
      const result = await fetch('/api/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          items: cartItems,
          amount: totalAmount / 100,
        }),
      });

      if (result.ok) {
        alert('Order saved successfully!');
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <div className="checkout">
      <h2>Cart Summary</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.name} - ₹{item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ₹{(totalAmount / 100).toFixed(2)}</h3>

      <PaymentButton
        amount={totalAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

// ============================================================
// EXAMPLE 3: With Loading and Status Tracking
// ============================================================

function AdvancedCheckout() {
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleSuccess = (response) => {
    setOrderStatus('completed');
    setOrderDetails(response);

    // Send confirmation email
    sendConfirmationEmail({
      email: 'customer@example.com',
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
    });
  };

  const sendConfirmationEmail = async (data) => {
    try {
      await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  if (orderStatus === 'completed') {
    return (
      <div className="success-message">
        <h2>✓ Payment Successful!</h2>
        <p>Order ID: {orderDetails.razorpay_order_id}</p>
        <p>Payment ID: {orderDetails.razorpay_payment_id}</p>
        <p>A confirmation email has been sent to you.</p>
      </div>
    );
  }

  return (
    <div className="checkout-form">
      <h2>Proceed to Payment</h2>
      <PaymentButton
        amount={50000}
        onPaymentSuccess={handleSuccess}
      />
    </div>
  );
}

// ============================================================
// EXAMPLE 4: Multiple Payment Options
// ============================================================

function PaymentOptions() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = {
    basic: { name: 'Basic', amount: 99 * 100, books: 5 },      // ₹99
    premium: { name: 'Premium', amount: 299 * 100, books: 20 }, // ₹299
    pro: { name: 'Pro', amount: 999 * 100, books: 100 },       // ₹999
  };

  if (!selectedPlan) {
    return (
      <div className="plan-selection">
        <h2>Choose Your Plan</h2>
        {Object.entries(plans).map(([key, plan]) => (
          <div key={key} className="plan-card">
            <h3>{plan.name}</h3>
            <p>₹{plan.amount / 100}</p>
            <p>{plan.books} books included</p>
            <button onClick={() => setSelectedPlan(key)}>
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>
    );
  }

  const plan = plans[selectedPlan];

  return (
    <div className="payment-container">
      <h2>Payment for {plan.name} Plan</h2>
      <p>Amount: ₹{plan.amount / 100}</p>

      <PaymentButton
        amount={plan.amount}
        onPaymentSuccess={(response) => {
          alert(`Subscribed to ${plan.name} plan!`);
          console.log(response);
        }}
      />

      <button onClick={() => setSelectedPlan(null)}>
        Back to Plans
      </button>
    </div>
  );
}

// ============================================================
// EXAMPLE 5: With Custom Error Handling
// ============================================================

function RobustPayment() {
  const [errors, setErrors] = useState([]);

  const handleFailure = (error) => {
    const errorMap = {
      'Failed to load Razorpay': 'Razorpay service unavailable. Please try again later.',
      'Failed to create order': 'Could not create order. Please check your internet connection.',
      'Payment verification failed': 'Payment could not be verified. Please contact support.',
      'Payment cancelled by user': 'Payment was cancelled. Feel free to try again.',
    };

    const message = errorMap[error] || error;
    setErrors([...errors, message]);

    // Auto-clear errors after 5 seconds
    setTimeout(() => {
      setErrors(err => err.slice(1));
    }, 5000);
  };

  return (
    <div>
      {/* Error Display */}
      {errors.length > 0 && (
        <div className="error-list">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}

      {/* Payment Button */}
      <PaymentButton
        amount={50000}
        onPaymentFailure={handleFailure}
        onPaymentSuccess={() => setErrors([])}
      />
    </div>
  );
}

// ============================================================
// EXAMPLE 6: Modal Payment Flow
// ============================================================

function ModalPayment() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div>
      <button 
        className="checkout-btn"
        onClick={() => setShowPayment(true)}
      >
        Continue to Checkout
      </button>

      {showPayment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={() => setShowPayment(false)}
            >
              ✕
            </button>

            <h2>Complete Your Payment</h2>

            <PaymentButton
              amount={50000}
              onPaymentSuccess={(response) => {
                alert('Payment successful!');
                setShowPayment(false);
              }}
              onPaymentFailure={(error) => {
                console.log('Payment failed:', error);
                // Keep modal open for retry
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXAMPLE 7: Subscription Payment
// ============================================================

function SubscriptionPayment() {
  const handleSubscriptionSuccess = (response) => {
    // Save subscription details
    const subscriptionData = {
      userId: 'user_123',
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      planType: 'monthly',
      amount: 99,
      startDate: new Date(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    // Save to database
    fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionData),
    });
  };

  return (
    <div className="subscription">
      <h2>Subscribe to Premium</h2>
      <p>Monthly Plan - ₹99/month</p>
      <ul>
        <li>✓ Unlimited books</li>
        <li>✓ Offline reading</li>
        <li>✓ Ad-free experience</li>
      </ul>

      <PaymentButton
        amount={9900}  // ₹99
        onPaymentSuccess={handleSubscriptionSuccess}
      />

      <p className="auto-renewal-notice">
        Your subscription will auto-renew every month. 
        Cancel anytime from settings.
      </p>
    </div>
  );
}

// ============================================================
// EXAMPLE 8: Gift Card Purchase
// ============================================================

function GiftCardPayment() {
  const [selectedAmount, setSelectedAmount] = useState(500);

  const amounts = [250, 500, 1000, 2000, 5000];

  const handleGiftCardSuccess = (response) => {
    // Generate gift card code
    const giftCardCode = `GC${response.razorpay_payment_id.substring(4)}`;

    // Save gift card
    fetch('/api/gift-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: giftCardCode,
        amount: selectedAmount,
        orderId: response.razorpay_order_id,
        status: 'active',
      }),
    });

    alert(`Gift card created: ${giftCardCode}\nAmount: ₹${selectedAmount}`);
  };

  return (
    <div className="gift-card">
      <h2>Purchase Gift Card</h2>

      <div className="amount-selector">
        {amounts.map(amount => (
          <button
            key={amount}
            className={selectedAmount === amount ? 'active' : ''}
            onClick={() => setSelectedAmount(amount)}
          >
            ₹{amount}
          </button>
        ))}
      </div>

      <p>Selected: ₹{selectedAmount}</p>

      <PaymentButton
        amount={selectedAmount * 100}
        onPaymentSuccess={handleGiftCardSuccess}
      />
    </div>
  );
}

// ============================================================
// EXPORT EXAMPLES (Choose the one you need)
// ============================================================

export {
  BasicExample,
  CartCheckout,
  AdvancedCheckout,
  PaymentOptions,
  RobustPayment,
  ModalPayment,
  SubscriptionPayment,
  GiftCardPayment,
};

// ============================================================
// USAGE IN App.js
// ============================================================

/*
// Simple usage:
import { BasicExample } from './examples/PaymentExamples';

function App() {
  return <BasicExample />;
}

// Or use CartCheckout with real data:
import { CartCheckout } from './examples/PaymentExamples';

function App() {
  return <CartCheckout />;
}
*/
