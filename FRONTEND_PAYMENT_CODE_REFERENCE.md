# Frontend Payment Flow - CartDrawer.js Reference

This document shows the key updated payment handling code in `src/components/CartDrawer.js`

## Dynamic Backend URL Configuration

```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// This uses environment variables from .env:
// REACT_APP_BACKEND_URL=https://online-book-store-ce1n.onrender.com (production)
// Or falls back to localhost:5000 (development)
```

## Loading Razorpay Script

```javascript
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('✓ Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('✗ Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
```

## Complete Payment Handler

```javascript
const handleRazorpayPayment = async () => {
  try {
    setIsProcessing(true);
    setPaymentStatus(null);

    console.log('🔐 Initiating payment process...');
    console.log('Backend URL:', BACKEND_URL);

    // Step 1: Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      throw new Error('Failed to load Razorpay checkout script');
    }

    // Step 2: Create order on backend
    console.log('📦 Creating order with amount:', total * 100, 'paise');
    const orderResponse = await fetch(`${BACKEND_URL}/create-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(total * 100), // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      }),
    });

    // Check if response is OK
    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Backend returned ${orderResponse.status}: ${errorText}`);
    }

    const orderData = await orderResponse.json();
    console.log('✓ Order created:', orderData);
    
    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order');
    }

    // Step 3: Open Razorpay checkout
    console.log('💳 Opening Razorpay checkout...');
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Public key
      order_id: orderData.order.id,
      amount: orderData.order.amount,
      currency: 'INR',
      name: 'Online Book Store',
      description: 'Purchase Books',
      handler: async (response) => {
        try {
          console.log('✓ Payment completed, verifying signature...');
          console.log('Payment response:', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
          });
          
          // Step 4: Verify payment on backend
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

          // Check verification response
          if (!verifyResponse.ok) {
            const errorText = await verifyResponse.text();
            console.error('Verification error:', errorText);
            throw new Error(`Payment verification failed: ${errorText}`);
          }

          const verifyData = await verifyResponse.json();
          console.log('✓ Verification response:', verifyData);
          
          // Step 5: Handle verified payment
          if (verifyData.success) {
            console.log('✓✓ Payment verified successfully!');
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
            const errorMsg = verifyData.message || 'Payment verification failed';
            console.error('✗ Verification failed:', errorMsg);
            throw new Error(errorMsg);
          }
        } catch (verifyError) {
          console.error('Error during payment verification:', verifyError);
          setPaymentStatus({
            type: 'error',
            message: `✗ Verification failed: ${verifyError.message}. Payment may have been completed but not verified.`,
          });
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
          console.log('User closed Razorpay modal');
          setPaymentStatus({
            type: 'error',
            message: 'Payment cancelled by user',
          });
        },
      },
    };

    // Step 6: Open Razorpay modal
    const razorpay = new window.Razorpay(options);
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
```

## Console Output for Debugging

When a payment is successful, you should see in browser console (F12 → Console):

```
🔐 Initiating payment process...
Backend URL: https://online-book-store-ce1n.onrender.com
✓ Razorpay script loaded successfully
📦 Creating order with amount: 5000 paise
✓ Order created: {
  success: true,
  order: { id: 'order_XXXXXXXX', amount: 5000, currency: 'INR', status: 'created' }
}
💳 Opening Razorpay checkout...
✓ Payment completed, verifying signature...
Payment response: {
  orderId: 'order_XXXXXXXX',
  paymentId: 'pay_XXXXXXXX'
}
✓ Verification response: {
  success: true,
  message: 'Payment verified successfully',
  paymentDetails: { orderId: 'order_XXXXXXXX', paymentId: 'pay_XXXXXXXX' }
}
✓✓ Payment verified successfully!
```

## Error Scenarios & Console Logs

### Scenario 1: Network Error

```
❌ Payment error: Error: Failed to fetch
✗ Payment failed: Failed to fetch
```
**Fix:** Check backend URL, verify Render backend is running

### Scenario 2: CORS Error

```
❌ Payment error: Error: Fetch error
✗ Payment failed: Fetch error
```
**Fix:** Add Vercel domain to backend CORS whitelist

### Scenario 3: Invalid Signature

```
✓ Verification response: {
  success: false,
  message: 'Payment verification failed - Invalid signature'
}
✗ Verification failed: Payment verification failed - Invalid signature
```
**Fix:** Ensure RAZORPAY_KEY_SECRET is correct on backend

### Scenario 4: User Closes Modal

```
User closed Razorpay modal
✗ Payment cancelled by user
```
**This is expected** - user chose not to pay

## Testing with Different Environments

### Local Development

```javascript
// .env.development (automatic)
REACT_APP_RAZORPAY_KEY_ID=rzp_test_XXXXX
REACT_APP_BACKEND_URL=http://localhost:5000
```

Backend command:
```powershell
cd backend
npm run dev
```

Frontend command:
```powershell
npm start
```

Console logs show:
```
Backend URL: http://localhost:5000
```

### Production

```javascript
// .env or Vercel environment variables
REACT_APP_RAZORPAY_KEY_ID=rzp_live_XXXXX
REACT_APP_BACKEND_URL=https://online-book-store-ce1n.onrender.com
```

Console logs show:
```
Backend URL: https://online-book-store-ce1n.onrender.com
```

## State Management

The component uses React hooks to manage payment state:

```javascript
const [paymentStatus, setPaymentStatus] = useState(null);
const [isProcessing, setIsProcessing] = useState(false);

// Payment status object structure:
// {
//   type: 'success' | 'error',
//   message: 'User-friendly message'
// }

// Used to:
// - Show success/error messages
// - Disable checkout button during processing
// - Automatically hide messages after 3 seconds
```

## Integration Points

### With CartContext

```javascript
const { cart, calculateSubtotal, calculateGST, calculateTotal, clearCart } = useCart();

// Payment uses calculateTotal() to get cart total
// After successful payment, calls clearCart() to empty cart
```

### With Razorpay SDK

```javascript
// Razorpay global object (loaded from CDN)
const razorpay = new window.Razorpay(options);
razorpay.open(); // Opens checkout modal
```

## API Endpoints Called

1. **POST `/create-order`** (backend)
   - Input: `{ amount, currency, receipt }`
   - Output: `{ success, order: { id, amount, currency, status } }`
   - Used by: Frontend to create Razorpay order

2. **POST `/verify-payment`** (backend)
   - Input: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
   - Output: `{ success, message, paymentDetails }`
   - Used by: Frontend to verify payment legitimacy

---

**Key Points:**
- ✅ Dynamic backend URL from environment variables
- ✅ Comprehensive error handling with descriptive messages
- ✅ Detailed console logging for debugging
- ✅ Backend signature verification (not frontend)
- ✅ User-friendly status messages
- ✅ Automatic cart clearing after success
- ✅ Modal auto-close after success

---

For full code, see: `src/components/CartDrawer.js`
