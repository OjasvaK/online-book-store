# 📚 Online Book Store - Razorpay Payment Integration

Complete, production-ready Razorpay payment integration for your Online Book Store application built with React and Express.js.

## 🎯 What's Included

✅ **Backend (Express.js)**
- Razorpay order creation API
- Payment signature verification
- CORS enabled
- Error handling & validation
- Environment variable management

✅ **Frontend (React)**
- PaymentButton component with hooks
- Razorpay checkout integration
- Success/failure handling
- Loading states and feedback messages
- Responsive design

✅ **Documentation**
- Complete setup guide
- Quick start guide
- Integration examples
- Setup checklist
- API documentation

✅ **Security**
- Secret key protection
- HMAC-SHA256 signature verification
- Environment variable isolation
- Never expose credentials

---

## 🚀 Quick Start (5 Minutes)

### 1. Get Razorpay Keys

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Copy your **Key ID** and **Key Secret**

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
PORT=5000
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup

In a new terminal, from root:
```bash
echo REACT_APP_RAZORPAY_KEY_ID=your_key_id > .env
echo REACT_APP_BACKEND_URL=http://localhost:5000 >> .env
```

Start frontend:
```bash
npm start
```

### 4. Test Payment

- Open http://localhost:3000
- Click "Pay ₹500" button
- Use test card: `4111 1111 1111 1111`
- Expiry: `12/25`, CVV: `123`
- See success message

✅ **Done!** Integration complete.

---

## 📁 Project Structure

```
online-book-store/
├── backend/
│   ├── server.js                    # Express server with Razorpay API
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Environment template
│   ├── .env                         # Local config (create from template)
│   └── README.md                    # Backend documentation
│
├── src/
│   ├── components/
│   │   ├── PaymentButton.js         # React payment component
│   │   ├── PaymentButton.css        # Payment button styles
│   │   └── [other components]
│   ├── App.js                       # Updated with payment integration
│   └── [other files]
│
├── public/
├── package.json                     # Frontend dependencies
├── .env                             # Frontend config (create manually)
│
├── PAYMENT_SETUP_GUIDE.md           # Detailed setup instructions
├── QUICK_START.md                   # 5-minute quick start
├── SETUP_CHECKLIST.md               # Verification checklist
├── INTEGRATION_EXAMPLES.js          # Code examples
└── README.md                        # This file
```

---

## 📡 API Endpoints

### Create Order
```http
POST /create-order
Content-Type: application/json

{
  "amount": 50000,
  "currency": "INR",
  "receipt": "receipt_1"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxx",
    "amount": 50000,
    "currency": "INR"
  }
}
```

### Verify Payment
```http
POST /verify-payment
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "xxx"
}
```

**Response:**
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

---

## 🧠 How It Works

### Payment Flow

```
1. User clicks "Pay" button
   ↓
2. Frontend calls backend /create-order
   ↓
3. Backend creates Razorpay order
   ↓
4. Frontend opens Razorpay checkout modal
   ↓
5. User enters payment details
   ↓
6. Razorpay processes payment
   ↓
7. Frontend receives payment response
   ↓
8. Frontend calls backend /verify-payment
   ↓
9. Backend verifies HMAC-SHA256 signature
   ↓
10. Show success/failure message
```

### Security

**Signature Verification:**
```
body = orderId | paymentId
signature = HMAC-SHA256(body, secretKey)

Frontend sends: signature from Razorpay
Backend calculates: expected signature
Backend compares: if match → valid payment
```

✅ This prevents fraud and tampering

---

## 💻 Component Usage

### Basic Usage

```jsx
import PaymentButton from './components/PaymentButton';

function App() {
  const handleSuccess = (response) => {
    console.log('Payment successful:', response.razorpay_order_id);
  };

  const handleFailure = (error) => {
    console.log('Payment failed:', error);
  };

  return (
    <PaymentButton
      amount={50000}  // Amount in paise
      onPaymentSuccess={handleSuccess}
      onPaymentFailure={handleFailure}
    />
  );
}
```

### With Cart Total

```jsx
const cartItems = [
  { price: 250, quantity: 2 },
  { price: 350, quantity: 1 }
];

const totalAmount = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
) * 100; // Convert to paise

<PaymentButton amount={totalAmount} />
```

---

## 🔑 Environment Variables

### Backend `.env`

```env
# Razorpay API credentials
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# Server config
PORT=5000
NODE_ENV=development
```

### Frontend `.env`

```env
# Razorpay public key (safe to expose)
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:5000
```

⚠️ **Important:**
- Never expose `RAZORPAY_KEY_SECRET` in frontend
- Frontend environment variables must start with `REACT_APP_`
- Restart development server after creating `.env`

---

## 🧪 Testing

### Test Cards

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- Expiry: `12/25` (any future month/year)
- CVV: `123` (any 3 digits)

**Failed Payment:**
- Card: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `100` (specific number to fail)

### Manual Testing

1. **Create Order Test:**
```bash
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":50000}'
```

2. **UI Test:**
   - Open http://localhost:3000
   - Click payment button
   - Check browser console for logs
   - Complete test payment
   - Verify success message

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Check Node.js installed: `node -v` |
| **CORS error** | Keep backend running on port 5000 |
| **"Invalid Key ID"** | Check `REACT_APP_RAZORPAY_KEY_ID` is correct |
| **Script fails to load** | Check internet, Razorpay CDN accessible |
| **Port 5000 in use** | Kill process or use `PORT=5001 npm run dev` |
| **Payment unverified** | Check backend logs, verify signature |

See `PAYMENT_SETUP_GUIDE.md` for detailed troubleshooting.

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup
- **[PAYMENT_SETUP_GUIDE.md](PAYMENT_SETUP_GUIDE.md)** - Complete guide
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Verification checklist
- **[INTEGRATION_EXAMPLES.js](INTEGRATION_EXAMPLES.js)** - Code examples
- **[backend/README.md](backend/README.md)** - Backend API docs

---

## 🔒 Security Checklist

✅ **Production Ready:**

- [ ] Using live Razorpay keys (not test)
- [ ] Secret key only in backend
- [ ] HTTPS enabled for all URLs
- [ ] CORS restricted to your domain
- [ ] Orders saved to database
- [ ] Email confirmations enabled
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] Payment records auditable

---

## 🎓 What You'll Learn

- ✅ Razorpay API integration
- ✅ Payment processing flow
- ✅ HMAC-SHA256 signature verification
- ✅ React hooks (useState, useEffect)
- ✅ Express.js API development
- ✅ Environment variable management
- ✅ CORS handling
- ✅ Error handling patterns
- ✅ Security best practices

---

## 💡 Next Steps

1. **Test the integration:**
   - Follow Quick Start above
   - Make a test payment
   - Check success message

2. **Customize for your needs:**
   - Modify payment amounts
   - Add custom product details
   - Implement order database

3. **Deploy to production:**
   - Get live Razorpay keys
   - Deploy backend (Heroku, AWS, etc.)
   - Deploy frontend (Vercel, Netlify, etc.)
   - Update environment variables

4. **Add features:**
   - Order history
   - Subscription handling
   - Refund management
   - Payment notifications

---

## 📞 Support

For help with:
- **Razorpay:** [razorpay.com/docs](https://razorpay.com/docs/)
- **React:** [react.dev](https://react.dev)
- **Express:** [expressjs.com](https://expressjs.com)
- **Node.js:** [nodejs.org](https://nodejs.org)

---

## 📋 Features

✅ Complete payment workflow
✅ Signature verification
✅ Error handling
✅ Loading states
✅ Success/failure messages
✅ Responsive design
✅ Clean code with comments
✅ Async/await patterns
✅ Environment variables
✅ CORS enabled
✅ Production ready
✅ Comprehensive docs

---

## 🎉 Ready to Accept Payments!

Your Razorpay integration is complete and ready to use.

**Get started:**
1. Run quick start steps above
2. Get Razorpay keys
3. Create `.env` files
4. Start backend and frontend
5. Test payment flow
6. Deploy to production

**Questions?** Check the documentation files or review the code comments.

---

## 📜 License

This integration guide is provided as-is for your Online Book Store project.

---

**Built with ❤️ for Online Book Store**

Last Updated: 2024
Version: 1.0.0
