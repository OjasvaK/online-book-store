# ✅ Setup Verification Checklist

Complete this checklist to ensure all components are properly set up.

---

## 📋 Pre-Setup Requirements

- [ ] Node.js installed (v14+)
  - Run: `node --version`
  - Current version should be v14.0.0 or higher

- [ ] npm installed
  - Run: `npm --version`
  - Current version should be v6.0.0 or higher

- [ ] Code editor (VS Code recommended)
  - [Download VS Code](https://code.visualstudio.com/)

- [ ] Razorpay Account created
  - Visit [razorpay.com](https://razorpay.com)
  - Sign up for free

---

## 🔑 Razorpay Setup

- [ ] Logged into Razorpay Dashboard
  - URL: https://dashboard.razorpay.com/app/dashboard

- [ ] Located API Keys
  - Path: Settings → API Keys
  - [ ] Found Key ID (starts with `rzp_test_` or `rzp_live_`)
  - [ ] Found Key Secret

- [ ] Test Mode Keys obtained
  - Using test keys for development
  - Test credentials saved safely

---

## 🚀 Backend Setup

### Installation

- [ ] Navigated to `backend` folder
  - Command: `cd backend`

- [ ] Installed dependencies
  - Command: `npm install`
  - File check: `node_modules` folder created
  - File check: `package-lock.json` created

### Configuration

- [ ] Created `.env` file
  - Command: `cp .env.example .env`
  - File created: `backend/.env`
  - File check: `.env` NOT `.env.example`

- [ ] Added Razorpay credentials to `.env`
  ```env
  RAZORPAY_KEY_ID=your_key_id_here
  RAZORPAY_KEY_SECRET=your_key_secret_here
  PORT=5000
  NODE_ENV=development
  ```
  - [ ] `RAZORPAY_KEY_ID` filled with actual key
  - [ ] `RAZORPAY_KEY_SECRET` filled with actual secret
  - [ ] PORT set to 5000
  - [ ] NODE_ENV set to development

- [ ] `.env` file is gitignored
  - File check: `.env` in `.gitignore` (optional but recommended)

### Verification

- [ ] Backend server starts without errors
  - Command: `npm run dev`
  - Expected output: "Server running on http://localhost:5000"
  - [ ] No error messages in console
  - [ ] Server maintains connection

- [ ] API endpoints accessible
  - Test: `curl http://localhost:5000`
  - Should return JSON with endpoints listed

---

## 💻 Frontend Setup

### File Creation

- [ ] PaymentButton component exists
  - File: `src/components/PaymentButton.js`
  - [ ] File contains React component
  - [ ] File has proper imports and exports

- [ ] PaymentButton styles exist
  - File: `src/components/PaymentButton.css`
  - [ ] File contains styling for `.payment-button`
  - [ ] File contains styling for `.payment-status`

- [ ] App.js updated with payment integration
  - File: `src/App.js`
  - [ ] Imports `PaymentButton` component
  - [ ] Has `handlePaymentSuccess` function
  - [ ] Has `handlePaymentFailure` function
  - [ ] Uses `<PaymentButton>` component with props

### Environment Variables

- [ ] Created `.env` in root folder
  - File location: `online-book-store/.env` (not in src/)
  - File check: `.env` file exists in root

- [ ] Added environment variables to `.env`
  ```env
  REACT_APP_RAZORPAY_KEY_ID=your_key_id_here
  REACT_APP_BACKEND_URL=http://localhost:5000
  ```
  - [ ] `REACT_APP_RAZORPAY_KEY_ID` filled with actual key
  - [ ] `REACT_APP_BACKEND_URL` set to backend URL
  - [ ] Variables start with `REACT_APP_` prefix

- [ ] Dependencies installed
  - Command: `npm install`
  - File check: `node_modules` folder exists
  - File check: `package-lock.json` updated

### Verification

- [ ] Frontend server starts
  - Command: `npm start`
  - Expected output: "Compiled successfully!"
  - Page opens in browser: http://localhost:3000

- [ ] React app loads without errors
  - [ ] No red errors in browser console
  - [ ] No TypeScript/ESLint errors

- [ ] PaymentButton component loads
  - [ ] Button visible on page
  - [ ] Button not grayed out/disabled by default
  - [ ] Can click the button

---

## 🔗 Integration Testing

### Cross-Communication

- [ ] Frontend can reach backend
  - Command: Keep both servers running in separate terminals
  - Test: Add console.log in PaymentButton, click button, check logs

- [ ] CORS not blocking requests
  - Check browser console (F12)
  - [ ] No "Access to XMLHttpRequest blocked by CORS" error
  - [ ] Network tab shows successful requests to backend

- [ ] Environment variables loaded
  - Test: Open browser DevTools → Console
  - Type: `fetch('/create-order')` to test API call
  - [ ] Should see network request to `http://localhost:5000`

### API Endpoints

- [ ] POST `/create-order` works
  - Using Postman or curl:
  ```bash
  curl -X POST http://localhost:5000/create-order \
    -H "Content-Type: application/json" \
    -d '{"amount":50000}'
  ```
  - [ ] Returns JSON with `success: true`
  - [ ] Returns `order.id` in response

- [ ] POST `/verify-payment` endpoint exists
  - [ ] Backend accepts verification requests
  - [ ] Backend validates signature format
  - [ ] Returns appropriate success/failure messages

---

## 💳 Payment Flow Test

### With Test Cards

- [ ] Razorpay script loads
  - Check browser console
  - [ ] No errors about script loading
  - [ ] `window.Razorpay` is defined

- [ ] Click Payment Button
  - [ ] Button shows "Processing..." state
  - [ ] Razorpay checkout modal opens
  - [ ] Modal shows payment form

- [ ] Enter Test Card Details
  ```
  Card: 4111 1111 1111 1111
  Expiry: 12/25
  CVV: 123
  ```
  - [ ] Form accepts input
  - [ ] "Pay Now" button clickable

- [ ] Complete Payment
  - [ ] Payment processes
  - [ ] Success message appears
  - [ ] Order ID displayed

- [ ] Backend Verification
  - Check backend terminal logs
  - [ ] See "Payment verified" message
  - [ ] No signature verification errors

- [ ] Payment Status Preserved
  - [ ] Success message visible for 3 seconds
  - [ ] No duplicate messages
  - [ ] Message disappears after timeout

---

## 🐛 Debugging Console Checks

### Browser Console (F12)

- [ ] No red error messages
  - [ ] No "Cannot find module" errors
  - [ ] No "Undefined variable" errors
  - [ ] No CORS policy errors

- [ ] Network tab shows requests
  - [ ] Request to `/create-order` successful (200 status)
  - [ ] Request to `/verify-payment` successful (200 status)
  - [ ] Response bodies are valid JSON

### Backend Terminal

- [ ] Server logs show requests
  - [ ] See POST /create-order requests
  - [ ] See POST /verify-payment requests
  - [ ] No "Cannot find module" errors
  - [ ] No undefined variable errors

---

## 🔒 Security Verification

- [ ] Secret key not exposed
  - [ ] `RAZORPAY_KEY_SECRET` only in backend `.env`
  - [ ] Not in frontend `.env` or code
  - [ ] Not in window object or console

- [ ] Key ID properly used
  - [ ] `REACT_APP_RAZORPAY_KEY_ID` only has Key ID (public)
  - [ ] Not mixing Key ID and Secret in frontend

- [ ] CORS properly configured
  - [ ] Backend has `cors()` middleware
  - [ ] Frontend can make requests to backend
  - [ ] No wildcard CORS in production

- [ ] Signature verification working
  - [ ] Backend verifies HMAC-SHA256 signature
  - [ ] Fraudulent signatures rejected
  - [ ] Valid signatures accepted

---

## 📦 File Structure Validation

```
✓ Project Structure Check:

online-book-store/
  ├── backend/
  │   ├── server.js                ✓ Created
  │   ├── package.json             ✓ Created
  │   ├── .env                     ✓ Created (from template)
  │   ├── .env.example             ✓ Created
  │   ├── README.md                ✓ Created
  │   └── node_modules/            ✓ Exists after npm install
  │
  ├── src/
  │   ├── components/
  │   │   ├── PaymentButton.js      ✓ Created
  │   │   ├── PaymentButton.css     ✓ Created
  │   │   └── [other components]    ✓ Exist
  │   ├── App.js                   ✓ Updated with payment
  │   └── [other files]
  │
  ├── .env                         ✓ Created at root
  ├── package.json                 ✓ Root package.json
  ├── PAYMENT_SETUP_GUIDE.md       ✓ Created
  ├── QUICK_START.md               ✓ Created
  ├── INTEGRATION_EXAMPLES.js      ✓ Created
  └── SETUP_CHECKLIST.md           ✓ This file
```

---

## ✅ Final Verification

### Run the Checklist

- [ ] All backend items checked
- [ ] All frontend items checked
- [ ] All integration tests passed
- [ ] All debugging checks clear
- [ ] All security verifications passed
- [ ] File structure matches template

### Complete Test Flow

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Expected: "Server running on http://localhost:5000"

2. **Terminal 2 - Frontend:**
   ```bash
   npm start
   ```
   Expected: "Compiled successfully! You can now view..."

3. **Browser:**
   - [ ] Open http://localhost:3000
   - [ ] See payment button
   - [ ] Add items to cart (if using BookList)
   - [ ] Click payment button
   - [ ] Razorpay modal opens
   - [ ] Enter test card
   - [ ] Payment succeeds
   - [ ] See success message

### Troubleshooting

If any check fails:
- [ ] Read the error message carefully
- [ ] Check the Troubleshooting section in `PAYMENT_SETUP_GUIDE.md`
- [ ] Review the relevant file (backend or frontend)
- [ ] Check console logs (browser and terminal)
- [ ] Restart the servers
- [ ] Clear browser cache (Ctrl+Shift+Delete)

---

## 🎉 Success Criteria

All of the following must be true:

✅ **Backend Working:**
- Node.js server running without errors
- Both API endpoints respond correctly
- Environment variables loaded
- CORS enabled

✅ **Frontend Working:**
- React app compiles successfully
- PaymentButton component renders
- Environment variables readable
- No console errors

✅ **Integration Working:**
- Frontend connects to backend
- Can click payment button
- Razorpay modal opens
- Test payment succeeds
- Success message displays
- Backend logs show verification

✅ **Security Verified:**
- Secret key not exposed
- Signature verification working
- CORS properly configured

---

## 🚀 Ready for Production?

Before deploying, also verify:

- [ ] Using live Razorpay keys (not test keys)
- [ ] Backend deployed to hosting (Heroku, AWS, etc.)
- [ ] Frontend deployed to hosting (Vercel, Netlify, etc.)
- [ ] Frontend `.env` points to live backend URL
- [ ] HTTPS enabled on both frontend and backend
- [ ] Error logging configured
- [ ] Database set up for order storage
- [ ] Email notifications configured
- [ ] Rate limiting enabled
- [ ] Security headers configured

---

## 📝 Notes

- **Test Keys:** Use during development. Orders created don't charge cards.
- **Live Keys:** Use in production. Real payments will be processed.
- **Environment Variables:** Must restart servers after changing `.env`
- **CORS:** In production, restrict to specific domain
- **Signatures:** Always verify on backend, never trust frontend

---

**If all items are checked, your Razorpay integration is complete and ready to test! ✨**

For issues, refer to:
- 📖 `PAYMENT_SETUP_GUIDE.md` - Detailed setup
- ⚡ `QUICK_START.md` - Quick reference
- 💡 `INTEGRATION_EXAMPLES.js` - Usage examples
- 🔧 `backend/README.md` - Backend details
