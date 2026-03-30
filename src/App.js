import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import BookList from './components/BookList';
import CartDrawer from './components/CartDrawer';
import PaymentButton from './components/PaymentButton';
import { useCart } from './context/CartContext';

function App() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all'
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
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

  /**
   * Calculate total cart amount in paise
   * (1 rupee = 100 paise)
   */
  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0) * 100;
  };

  /**
   * Handle successful payment
   */
  const handlePaymentSuccess = (response) => {
    console.log('✓ Payment Successful!', response);
    
    setPaymentStatus({
      type: 'success',
      message: `✓ Payment successful! Order ID: ${response.razorpay_order_id}`,
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
    });

    // Clear cart after successful payment
    setTimeout(() => {
      setPaymentStatus(null);
    }, 3000);
  };

  /**
   * Handle failed payment
   */
  const handlePaymentFailure = (error) => {
    console.log('✗ Payment Failed!', error);
    
    setPaymentStatus({
      type: 'error',
      message: `✗ Payment failed: ${error}. Please try again.`,
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = calculateTotalAmount();

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

        {/* Payment Section - Show when cart has items */}
        {cartCount > 0 && (
          <section className="payment-section">
            <div className="payment-card">
              <h2>Order Summary</h2>
              
              <div className="order-details">
                <p>
                  <strong>Items in Cart:</strong> {cartCount}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{(totalAmount / 100).toFixed(2)}
                </p>
              </div>

              {/* Payment Status Message */}
              {paymentStatus && (
                <div className={`payment-status ${paymentStatus.type}`}>
                  <p>{paymentStatus.message}</p>
                  {paymentStatus.orderId && (
                    <p className="order-id">
                      Order ID: {paymentStatus.orderId}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Button Component */}
              {paymentStatus?.type !== 'success' && (
                <PaymentButton
                  amount={totalAmount}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentFailure={handlePaymentFailure}
                />
              )}

              <p className="payment-disclaimer">
                💳 Secure payment powered by Razorpay
              </p>
            </div>
          </section>
        )}
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
