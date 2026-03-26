# API Reference - Backend Endpoints

## Base URLs

| Environment | URL |
|---|---|
| **Local Development** | `http://localhost:5000` |
| **Production (Render)** | `https://online-book-store-iru0.onrender.com` |

---

## Endpoints

### 1. GET `/` - Health Check

**Purpose:** Verify backend is running and responsive

**Request:**
```
GET https://online-book-store-iru0.onrender.com/
```

**Response (200 OK):**
```json
{
  "message": "Online Book Store Backend - Payment Integration API",
  "version": "1.0.0",
  "endpoints": {
    "createOrder": "POST /create-order",
    "verifyPayment": "POST /verify-payment"
  }
}
```

**Example (curl):**
```bash
curl https://online-book-store-iru0.onrender.com/
```

---

### 2. POST `/create-order` - Create Razorpay Order

**Purpose:** Create a new payment order with Razorpay

**Request:**
```
POST https://online-book-store-iru0.onrender.com/create-order
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 50000,
  "currency": "INR",
  "receipt": "receipt_1234567890"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|---|
| `amount` | number | Yes | Amount in **paise** (1 rupee = 100 paise). E.g., 50000 paise = ₹500 |
| `currency` | string | No | Currency code. Default: `INR` |
| `receipt` | string | No | Unique receipt ID. If not provided, auto-generated |

**Response (200 OK - Success):**
```json
{
  "success": true,
  "order": {
    "id": "order_9A33XWu170gUtm",
    "amount": 50000,
    "currency": "INR",
    "status": "created"
  }
}
```

**Response (400 Bad Request - Invalid Input):**
```json
{
  "success": false,
  "message": "Valid amount is required (must be greater than 0)"
}
```

**Response (500 Server Error):**
```json
{
  "success": false,
  "message": "Failed to create order",
  "error": "Razorpay API error details"
}
```

**Example (cURL):**
```bash
curl -X POST https://online-book-store-iru0.onrender.com/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "currency": "INR",
    "receipt": "receipt_'$(date +%s)'"
  }'
```

**Example (JavaScript/Fetch):**
```javascript
const response = await fetch('https://online-book-store-iru0.onrender.com/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: Math.round(500 * 100), // ₹500
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  }),
});

const data = await response.json();
console.log(data.order.id); // Use this order ID in Razorpay checkout
```

---

### 3. POST `/verify-payment` - Verify Payment Signature

**Purpose:** Verify that the payment was successful and genuine (HMAC-SHA256 signature verification)

**Request:**
```
POST https://online-book-store-iru0.onrender.com/verify-payment
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_9A33XWu170gUtm",
  "razorpay_payment_id": "pay_9A33XWu170gUtm",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|---|
| `razorpay_order_id` | string | Yes | Order ID returned from `/create-order` |
| `razorpay_payment_id` | string | Yes | Payment ID from Razorpay after payment completion |
| `razorpay_signature` | string | Yes | HMAC-SHA256 signature from Razorpay |

**Response (200 OK - Valid Payment):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentDetails": {
    "orderId": "order_9A33XWu170gUtm",
    "paymentId": "pay_9A33XWu170gUtm"
  }
}
```

**Response (400 Bad Request - Invalid Signature):**
```json
{
  "success": false,
  "message": "Payment verification failed - Invalid signature"
}
```

**Response (400 Bad Request - Missing Data):**
```json
{
  "success": false,
  "message": "Missing required payment verification data"
}
```

**Response (500 Server Error):**
```json
{
  "success": false,
  "message": "Error verifying payment",
  "error": "Error details"
}
```

**Example (JavaScript/Fetch):**
```javascript
const response = await fetch('https://online-book-store-iru0.onrender.com/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpay_order_id: razorpayResponse.razorpay_order_id,
    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
    razorpay_signature: razorpayResponse.razorpay_signature,
  }),
});

const result = await response.json();
if (result.success) {
  console.log('✓ Payment verified!');
} else {
  console.error('✗ Payment verification failed');
}
```

---

## Complete Payment Flow Example

```javascript
// Step 1: Create Order
const createOrderResponse = await fetch(`${BACKEND_URL}/create-order`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 50000, // ₹500
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  }),
});

const orderData = await createOrderResponse.json();
const orderId = orderData.order.id;
console.log('Order created:', orderId);

// Step 2: Open Razorpay Checkout (user completes payment here)
const razorpayOptions = {
  key: 'rzp_live_YOUR_PUBLIC_KEY',
  order_id: orderId,
  amount: 50000,
  currency: 'INR',
  name: 'Online Book Store',
  description: 'Purchase Books',
  handler: async (paymentResponse) => {
    // Step 3: Verify Payment Signature
    const verifyResponse = await fetch(`${BACKEND_URL}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      }),
    });

    const verifyData = await verifyResponse.json();
    if (verifyData.success) {
      console.log('✓ Payment successful and verified!');
      // Process successful payment
    } else {
      console.error('✗ Payment verification failed');
      // Handle failed verification
    }
  },
};

const razorpay = new window.Razorpay(razorpayOptions);
razorpay.open();
```

---

## Error Handling Guide

### Common HTTP Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters or failed verification |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Server Error | Backend error |

### Error Response Structure

```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details (dev only)"
}
```

### Examples

**Example 1: Amount too low**
```json
{
  "success": false,
  "message": "Valid amount is required (must be greater than 0)"
}
```

**Example 2: Razorpay API unavailable**
```json
{
  "success": false,
  "message": "Failed to create order",
  "error": "Razorpay API error"
}
```

**Example 3: Invalid signature**
```json
{
  "success": false,
  "message": "Payment verification failed - Invalid signature"
}
```

---

## Testing Endpoints Locally

### Test 1: Health Check
```bash
curl http://localhost:5000/
```

### Test 2: Create Order
```bash
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "currency": "INR"}'
```

### Test 3: Invalid Request
```bash
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 0}'  # Amount is invalid
```

---

## Production Testing

### Test with Test Keys (RECOMMENDED)

Use Razorpay test mode keys:
```
Key ID: rzp_test_XXXXXXXXXXXXX
Secret: rzp_test_XXXXXXXXXXXXX
```

Test payment with card: `4111 1111 1111 1111`
- No charges occur
- Complete payment flow is tested

### Test with Live Keys & Test Cards (NOT RECOMMENDED)

Some card numbers won't be charged even with live keys:
- `4111 1111 1111 1111` (Visa)
- `3782 822463 10005` (Amex)

**⚠️ RISK:** Other cards may still be charged. Use test mode instead!

---

## Rate Limiting

Currently **no rate limiting** is implemented. For production:

Consider adding rate limiting middleware:
```javascript
const rateLimit = require('express-rate-limit');

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.post('/create-order', orderLimiter, async (req, res) => {
  // ...
});
```

---

## Security Notes

✅ **Good Practices Implemented:**
- HMAC-SHA256 signature verification
- Secret key stays on backend only
- Environment variable configuration
- CORS restrictions
- Input validation

⚠️ **Additional Security (Recommended):**
- Rate limiting to prevent abuse
- Database to store orders
- Webhook verification from Razorpay
- Request logging and monitoring
- DDoS protection (e.g., Cloudflare)

---

## Webhook Support (Future)

Razorpay can send webhooks for real-time updates:
```
POST /webhooks/razorpay
Event: payment.authorized
Event: payment.failed
```

Not currently implemented. Would allow:
- Real-time order updates
- Automatic email notifications
- Database synchronization

---

**API Version:** 1.0.0  
**Last Updated:** March 26, 2026  
**Status:** Production Ready ✅
