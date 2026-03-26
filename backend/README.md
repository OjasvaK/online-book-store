# Backend - Express Server with Razorpay Integration

Complete backend service for Online Book Store payment processing.

## 📋 Overview

This Express.js server handles:
- ✅ Order creation via Razorpay API
- ✅ Payment signature verification
- ✅ CORS handling for frontend requests
- ✅ Error handling and validation
- ✅ Environment variable management

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

Installs:
- **express** - Web framework
- **razorpay** - Razorpay SDK
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload

### 2. Create .env File

Copy the template:
```bash
cp .env.example .env
```

Edit `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
PORT=5000
NODE_ENV=development
```

### 3. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Expected output:
```
╔════════════════════════════════════════════════════════════╗
║     Online Book Store Backend - Razorpay Integration       ║
║     Server running on http://localhost:5000                    ║
╚════════════════════════════════════════════════════════════╝
Available Endpoints:
  • POST   http://localhost:5000/create-order
  • POST   http://localhost:5000/verify-payment
```

## 📡 API Endpoints

### 1. Create Order

**Endpoint:** `POST /create-order`

Creates a new Razorpay order for payment.

**Request:**
```bash
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "currency": "INR",
    "receipt": "receipt_123"
  }'
```

**Request Body:**
```json
{
  "amount": 50000,        // Required: Amount in paise (50000 = ₹500)
  "currency": "INR",      // Optional: Default "INR"
  "receipt": "receipt_1"  // Optional: Custom receipt ID
}
```

**Success Response (200):**
```json
{
  "success": true,
  "order": {
    "id": "order_L8wMXWlHaFIAqJ",
    "amount": 50000,
    "currency": "INR",
    "status": "created"
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Failed to create order",
  "error": "Error details..."
}
```

---

### 2. Verify Payment

**Endpoint:** `POST /verify-payment`

Verifies payment signature using HMAC-SHA256.

**Request:**
```bash
curl -X POST http://localhost:5000/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_L8wMXWlHaFIAqJ",
    "razorpay_payment_id": "pay_L8wMvYCfq0mJQp",
    "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
  }'
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",    // Required: Order ID from /create-order
  "razorpay_payment_id": "pay_xxx",    // Required: Payment ID from Razorpay
  "razorpay_signature": "xxx"          // Required: Signature hash from Razorpay
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentDetails": {
    "orderId": "order_L8wMXWlHaFIAqJ",
    "paymentId": "pay_L8wMvYCfq0mJQp"
  }
}
```

**Failure Response (400):**
```json
{
  "success": false,
  "message": "Payment verification failed - Invalid signature"
}
```

---

## 🔒 Security

**Signature Verification Logic:**

The signature is created using HMAC-SHA256:

```javascript
const body = `${razorpay_order_id}|${razorpay_payment_id}`;
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(body)
  .digest('hex');

if (expectedSignature === razorpay_signature) {
  // Payment is verified and legitimate
}
```

This ensures:
✅ Payment data hasn't been tampered with
✅ Request came from valid Razorpay
✅ Order and payment IDs match

**Important Notes:**
- ✅ `RAZORPAY_KEY_ID` is public - safe in frontend
- ❌ `RAZORPAY_KEY_SECRET` is private - NEVER expose
- ✅ Verification happens on backend using secret
- ❌ Frontend cannot verify signatures

---

## 📁 File Structure

```
backend/
├── server.js           # Main Express server
├── package.json        # Dependencies and scripts
├── .env               # Local environment variables (git ignored)
├── .env.example       # Template for .env
└── README.md          # This file
```

### server.js Sections

1. **Imports & Setup** (Lines 1-15)
   - Express, Razorpay, crypto, CORS
   - Initialize app and middleware

2. **Razorpay Initialization** (Line 16)
   - Create Razorpay instance with API keys
   - Keys loaded from environment variables

3. **POST /create-order** (Lines 20-50)
   - Validate input amount
   - Create Razorpay order
   - Return order details to frontend

4. **POST /verify-payment** (Lines 52-85)
   - Receive payment response from frontend
   - Verify HMAC-SHA256 signature
   - Confirm payment legitimacy

5. **Error Handling** (Lines 87-110)
   - 404 for unknown routes
   - Global error handler
   - Logs errors for debugging

6. **Server Launch** (Lines 112-120)
   - Listen on configured port
   - Display startup message

---

## 🔧 Configuration

### Environment Variables

```env
# Required for Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# Server
PORT=5000                    # Server port (default: 5000)
NODE_ENV=development         # development, staging, production
```

### Modifying CORS

To restrict to specific domain (production):

```javascript
// In server.js, replace cors()
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## 🧪 Testing with cURL

### Create Order
```bash
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":500000}'
```

### Verify Payment (after payment)
```bash
curl -X POST http://localhost:5000/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id":"order_xxx",
    "razorpay_payment_id":"pay_xxx",
    "razorpay_signature":"xxx"
  }'
```

---

## 📊 Development Workflow

### 1. Start Development Server
```bash
npm run dev
```
Server watches for file changes and auto-reloads.

### 2. View Logs
```
[nodemon] restarting due to changes...
```

### 3. Test Endpoints
Use Postman, Thunder Client, or cURL to test APIs.

### 4. Debug
```javascript
// Use console.log in code
console.error('Error creating order:', error);

// View in terminal immediately
```

---

## 🚀 Production Deployment

### Heroku Deployment

1. **Create Procfile:**
```
web: npm start
```

2. **Set environment variables:**
```bash
heroku config:set RAZORPAY_KEY_ID=YOUR_LIVE_KEY
heroku config:set RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
```

3. **Deploy:**
```bash
git push heroku main
```

### Railway Deployment

1. Connect GitHub repo
2. Set environment variables in dashboard
3. Auto-deploys on push

### Render Deployment

1. Create New → Web Service
2. Connect repository
3. Set environment variables
4. Deploy

---

## 🐛 Troubleshooting

### Server Won't Start

**Error:** `Cannot find module 'razorpay'`

**Solution:**
```bash
npm install razorpay
```

### Environment Variables Not Loading

**Error:** `Cannot read property 'key_id' of undefined`

**Solution:**
1. Create `.env` file (not `.env.example`)
2. Fill in actual values
3. Restart server: `npm run dev`

### Port Already in Use

**Error:** `listen EADDRINUSE :::5000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### CORS Error from Frontend

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Verify backend is running
- Check frontend `.env` has correct `REACT_APP_BACKEND_URL`
- Ensure `cors()` middleware is before routes

### Signature Verification Fails

**Error:** `Payment verification failed - Invalid signature`

**Causes:**
- Order ID or Payment ID mismatch
- Frontend using test key with live secret
- Incorrect signature calculation

**Solution:**
- Use matching test/live keys
- Verify order exists in Razorpay
- Check signature calculation

---

## 📚 Related Files

- **Frontend:** `../src/components/PaymentButton.js`
- **Setup Guide:** `../PAYMENT_SETUP_GUIDE.md`
- **Quick Start:** `../QUICK_START.md`
- **Frontend App:** `../src/App.js`

---

## 🔗 Resources

- [Razorpay Documentation](https://razorpay.com/docs)
- [Express.js Guide](https://expressjs.com)
- [Node.js Documentation](https://nodejs.org/docs)
- [HMAC-SHA256 Signing](https://en.wikipedia.org/wiki/HMAC)

---

**Backend Setup Complete! ✨**

Next: Set up frontend and connect them together.
