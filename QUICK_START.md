# Quick Start Guide - Razorpay Integration

## 🎯 5-Minute Setup

### Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
```

**Edit `backend/.env`:**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
PORT=5000
NODE_ENV=development
```

**Start backend:**
```bash
npm run dev
```

✅ Backend running on http://localhost:5000

---

### Step 2: Frontend Setup (3 minutes)

**In root directory (new terminal):**

```bash
# Create .env file
echo REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx > .env
echo REACT_APP_BACKEND_URL=http://localhost:5000 >> .env
```

**Or manually create `.env` in root:**
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
REACT_APP_BACKEND_URL=http://localhost:5000
```

**Start frontend:**
```bash
npm start
```

✅ Frontend running on http://localhost:3000

---

## 🧪 Test Payment

### Get Test Keys

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys**
3. Copy **Key ID** and **Key Secret**
4. Update your `.env` files

### Test Card Details

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`

**Steps:**
1. Open http://localhost:3000
2. Add books to cart
3. Click "Pay ₹XXX"
4. Use test card details above
5. Check for success message

---

## 📁 Files Created/Modified

```
✓ backend/server.js              - Express server with API endpoints
✓ backend/package.json           - Backend dependencies
✓ backend/.env.example           - Environment template
✓ src/components/PaymentButton.js - React payment component
✓ src/components/PaymentButton.css - Payment button styling
✓ src/App.js                     - Updated with payment integration
```

---

## 🔑 Key Features

✅ **Secure:**
- Secret key never exposed
- HMAC-SHA256 signature verification
- Environment variables for credentials

✅ **Complete:**
- Order creation
- Payment handling
- Signature verification
- Error handling

✅ **User-Friendly:**
- Loading states
- Success/error messages
- Smooth payment flow
- Responsive design

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Backend won't start | Verify Node.js installed: `node --version` |
| Can't find module | Run: `cd backend && npm install` |
| CORS error | Keep backend running on port 5000 |
| "Invalid Key ID" | Check `REACT_APP_RAZORPAY_KEY_ID` starts with `rzp_test_` |
| Script fails to load | Check internet connection, Razorpay CDN accessible |
| Port 5000 in use | Kill process or use `PORT=5001 npm run dev` |

---

## 📚 Next Steps

1. **Get Live Keys:** Replace test keys with live keys from Razorpay
2. **Save Orders:** Add database integration to store order details
3. **Email Confirmation:** Send order confirmation emails
4. **Deployment:** Deploy backend and frontend

---

## 📖 Full Guide

See `PAYMENT_SETUP_GUIDE.md` for detailed documentation.

---

**Ready to accept payments! 🚀**
