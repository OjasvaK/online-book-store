# Online Book Store - Razorpay Payment Integration Guide

Complete setup and deployment guide for integrating Razorpay payments into your Online Book Store application.

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Getting Razorpay Keys](#getting-razorpay-keys)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Testing the Payment Flow](#testing-the-payment-flow)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)

---

## 📁 Project Structure

```
online-book-store/
├── backend/                    # Express server for payment handling
│   ├── server.js              # Main server file with API endpoints
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment variables template
│   └── .env                   # Local environment variables (create this)
│
├── src/                        # React frontend code
│   ├── components/
│   │   ├── PaymentButton.js   # Payment integration component
│   │   ├── PaymentButton.css  # Payment button styles
│   │   └── [other components]
│   └── App.js
│
└── README.md
```

---

## 🔧 Prerequisites

Make sure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional)
- **Razorpay Account** - [Sign up free](https://razorpay.com/)

Verify installation:
```bash
node --version
npm --version
```

---

## 🔑 Getting Razorpay Keys

1. **Create a Razorpay Account**
   - Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Sign up or log in

2. **Generate API Keys**
   - Go to Settings → API Keys
   - You'll see two keys:
     - **Key ID** (Public key - safe for frontend)
     - **Key Secret** (Private key - keep secret! Only for backend)

3. **Copy Your Keys**
   - Key ID: `rzp_test_xxxxxxxxxxxx` (or live key)
   - Key Secret: `xxxxxxxxxxxxxxxx` (keep this secret!)

---

## 🚀 Backend Setup

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- **express** - Web framework
- **razorpay** - Razorpay SDK
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Auto-reload during development (dev dependency)

### Step 3: Create .env File

Copy the `.env.example` template and create `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and add your Razorpay credentials:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
PORT=5000
NODE_ENV=development
```

⚠️ **Important**: 
- Never commit `.env` to version control
- Keep `RAZORPAY_KEY_SECRET` private - never expose to frontend
- Use `.env.example` as template for documentation

### Step 4: Start Backend Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║     Online Book Store Backend - Razorpay Integration       ║
║     Server running on http://localhost:5000                    ║
╚════════════════════════════════════════════════════════════╝
```

✅ Backend is ready! Leave this terminal running.

---

## 🎨 Frontend Setup

### Step 1: Open New Terminal (Keep Backend Running)

Open a **new terminal/command prompt** in the project root:

```bash
cd src
```

### Step 2: Create .env File

In the root of your React project, create `.env`:

```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
REACT_APP_BACKEND_URL=http://localhost:5000
```

**Important Notes:**
- React only reads environment variables prefixed with `REACT_APP_`
- This Key ID is public (safe to expose in frontend)
- The Backend URL should match your backend server address

### Step 3: Install Frontend Dependencies

Make sure you're in the project root (where `package.json` is), then:

```bash
npm install
```

This includes the React app dependencies.

### Step 4: Add PaymentButton to App

Edit your `src/App.js` to import and use the PaymentButton component:

```jsx
import React from 'react';
import PaymentButton from './components/PaymentButton';
import './App.css';

function App() {
  const handlePaymentSuccess = (response) => {
    console.log('Payment successful:', response);
    // Handle success - e.g., update user account, show confirmation
  };

  const handlePaymentFailure = (error) => {
    console.log('Payment failed:', error);
    // Handle failure - e.g., show retry option
  };

  return (
    <div className="App">
      <h1>Online Book Store</h1>
      
      {/* Payment Component */}
      <PaymentButton
        amount={50000}  // Amount in paise (₹500)
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    </div>
  );
}

export default App;
```

---

## ▶️ Running the Application

### Complete Startup Sequence

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
```

#### Terminal 2 - Frontend Development Server

```bash
npm start
```

Expected output:
```
Compiled successfully!
You can now view the app in the browser at http://localhost:3000
```

✅ **Application is Live!**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🧪 Testing the Payment Flow

### Test Credentials (Razorpay Test Mode)

Use these test card details in Razorpay checkout:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- Expiry: `12/25` (any future date)
- CVV: `123` (any 3 digits)
- Name: Any name
- Email: Any email@example.com

**Failed Payment (OTP):**
- Card Number: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `100`
- OTP: `000000`

### Step-by-Step Test

1. Open http://localhost:3000 in your browser
2. Click the **"Pay ₹500"** button (or your configured amount)
3. Razorpay checkout modal opens
4. Fill test card details from above
5. Click **"Pay Now"**
6. Check browser console for:
   ```
   Payment verified: { orderId: "order_xxx", paymentId: "pay_xxx" }
   ```
7. See success message: ✓ Payment successful!

### Debugging

If something goes wrong:

```javascript
// Open browser DevTools (F12 or Right-click → Inspect)
// Go to Console tab to see detailed error messages
// Check Network tab to see API calls
```

Backend logs (Terminal 1):
```
Error creating order: [error details]
Error verifying payment: [error details]
```

---

## 📡 API Documentation

### 1. Create Order Endpoint

**URL:** `POST /create-order`

**Request Body:**
```json
{
  "amount": 50000,
  "currency": "INR",
  "receipt": "receipt_123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "order": {
    "id": "order_xxx",
    "amount": 50000,
    "currency": "INR",
    "status": "created"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Failed to create order",
  "error": "Error details"
}
```

---

### 2. Verify Payment Endpoint

**URL:** `POST /verify-payment`

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentDetails": {
    "orderId": "order_xxx",
    "paymentId": "pay_xxx"
  }
}
```

**Response (Failed Verification):**
```json
{
  "success": false,
  "message": "Payment verification failed - Invalid signature"
}
```

---

## 🔒 Security Best Practices

✅ **What We're Doing Right:**

1. **Key Secret is Secure**
   - Stored only in backend
   - Never exposed to frontend
   - Protected by `.env` file

2. **Signature Verification**
   - Payment verified on backend using HMAC-SHA256
   - Prevents fraud and tampering

3. **Environment Variables**
   - Credentials managed via `.env`
   - Different for dev, staging, production

4. **CORS Enabled**
   - Backend accepts requests only from authorized origins

⚠️ **Production Checklist:**

- [ ] Use Razorpay's **Live Keys** (not test keys)
- [ ] Enable CORS with specific domain: `cors({ origin: 'yourdomain.com' })`
- [ ] Use HTTPS for all requests
- [ ] Store payments in database for audit trail
- [ ] Implement rate limiting on endpoints
- [ ] Add request validation and sanitization
- [ ] Set up proper error logging and monitoring
- [ ] Never console.log sensitive data in production
- [ ] Use environment-specific configurations
- [ ] Regularly rotate API keys

---

## 🐛 Troubleshooting

### Backend Issues

#### Error: "Cannot find module 'razorpay'"
```bash
cd backend
npm install razorpay
```

#### Error: CORS error when calling backend
- Check if backend is running on port 5000
- Verify `REACT_APP_BACKEND_URL` in frontend `.env`
- Backend should have `cors()` middleware enabled

#### Error: "RAZORPAY_KEY_ID is undefined"
- Check `.env` file in backend folder
- Ensure you created `.env` (not `.env.example`)
- Restart backend server after adding `.env`

### Frontend Issues

#### Razorpay script fails to load
- Check internet connection (CDN must be accessible)
- Check browser console for CORS errors
- Verify `REACT_APP_RAZORPAY_KEY_ID` is correct

#### Payment button disabled after payment
- Check backend logs for verification errors
- Verify payment signature using test cards only

#### "Invalid Key ID" error
- Check `REACT_APP_RAZORPAY_KEY_ID` (should be Key ID, not Key Secret)
- Ensure it's prefixed with `REACT_APP_`
- Verify you copied the correct key from Razorpay dashboard

### General Issues

#### Port 5000 already in use
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

#### Port 3000 already in use
```bash
# Specify different port
DANGEROUSLY_SET_LOCALHOST=false PORT=3001 npm start
```

#### Environment variables not loading
- Restart development server after creating `.env`
- Use exact variable names (case-sensitive)
- React requires `REACT_APP_` prefix

---

## 📚 File Reference

### Backend Files

**`backend/server.js`** (Main server file)
- Express server setup
- `/create-order` endpoint
- `/verify-payment` endpoint
- Error handling and CORS

**`backend/package.json`**
- Dependencies: express, razorpay, cors, dotenv
- Scripts: start, dev

**`backend/.env`** (Create from `.env.example`)
- Razorpay API credentials
- Server port
- Environment mode

### Frontend Files

**`src/components/PaymentButton.js`**
- React component with payment logic
- Loads Razorpay script dynamically
- Manages loading/success/error states
- PropTypes for type safety

**`src/components/PaymentButton.css`**
- Styling for payment button
- Success/error message styles
- Responsive design

**`src/App.js`** (Updated)
- Imports and uses PaymentButton component
- Handles success/failure callbacks

**Root `.env`** (Frontend)
- Razorpay Key ID (public)
- Backend API URL

---

## 🌐 Deploying to Production

### Backend Deployment (to Heroku/Railway/Render)

1. Create `Procfile` in backend folder:
```
web: npm start
```

2. Push to Git and deploy
3. Add production environment variables on hosting platform
4. Use live Razorpay keys

### Frontend Deployment (to Vercel/Netlify)

1. Build production version:
```bash
npm run build
```

2. Deploy `build/` folder
3. Set environment variables on hosting platform
4. Update backend URL to production URL

---

## 📖 Additional Resources

- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Razorpay Integration Guide](https://razorpay.com/docs/checkout/beginners-guide/)
- [Express.js Guide](https://expressjs.com/)
- [React Hooks Documentation](https://react.dev/reference/react)

---

## 💡 Tips & Best Practices

1. **Testing**
   - Always test with test keys first
   - Use provided test card details
   - Test both success and failure scenarios

2. **Code Organization**
   - Keep API URLs in config file
   - Separate concerns (payment, validation, etc.)
   - Add TypeScript for type safety (optional)

3. **User Experience**
   - Show clear loading states
   - Provide instant feedback
   - Handle errors gracefully

4. **Performance**
   - Load Razorpay script only when needed
   - Cache script to avoid re-downloading
   - Optimize bundle size

---

## ✨ Features Included

✅ Complete Razorpay integration
✅ HMAC-SHA256 signature verification
✅ Error handling and validation
✅ Loading states and user feedback
✅ Responsive design
✅ Environment variable management
✅ CORS enabled
✅ Async/await for clean code
✅ PropTypes for type safety
✅ Comprehensive comments

---

## 📞 Support

For issues or questions:
- Check the Troubleshooting section
- Review Razorpay documentation
- Check browser console for error messages
- Check backend logs in terminal

---

**Happy Coding! 🚀**

Created for Online Book Store with ❤️
