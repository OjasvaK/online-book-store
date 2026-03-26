# 🚀 Master Installation & Setup Guide

**Complete step-by-step guide to install and run Razorpay payment integration for Online Book Store.**

---

## ⏱️ Total Time: ~15 minutes

- Razorpay setup: 3 minutes
- Backend setup: 5 minutes
- Frontend setup: 5 minutes
- Testing: 2 minutes

---

## 🎯 Step 1: Prepare - Get Your Razorpay Keys (3 min)

### Step 1.1: Create Razorpay Account

1. Open https://dashboard.razorpay.com/
2. Click **"Sign up"** or **"Log in"** if you have account
3. Fill sign-up form (email, password, mobile)
4. Verify email (check your inbox)

### Step 1.2: Get API Keys

1. Log in to Razorpay Dashboard
2. Navigate to **Settings** (gear icon top-right)
3. Click **API Keys** in left menu
4. You'll see two keys:
   - **Key ID:** `rzp_test_XXXXXXXXXX`
   - **Key Secret:** `XXXXXXXXXXXXXXXX`

### Step 1.3: Save Your Keys

Save these somewhere safe (NOT in code!):

```
Key ID:     rzp_test_XXXXXXXXXX
Key Secret: XXXXXXXXXXXXXXXX
```

✅ **Keys are ready**

---

## 🔧 Step 2: Backend Setup (5 min)

### Step 2.1: Navigate to Backend

Open terminal/command prompt and run:

```bash
cd backend
```

**Expected:** You're now in the `backend` folder

### Step 2.2: Install Dependencies

```bash
npm install
```

**Expected:** 
- Takes 2-3 minutes
- Creates `node_modules` folder
- Creates `package-lock.json` file
- No error messages

### Step 2.3: Create Environment File

**Option A - Windows (PowerShell):**
```bash
copy .env.example .env
```

**Option B - Mac/Linux:**
```bash
cp .env.example .env
```

**Expected:** New `.env` file created in `backend` folder

### Step 2.4: Edit .env File

Open `backend/.env` with your code editor and replace the placeholder values:

**Before:**
```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
PORT=5000
NODE_ENV=development
```

**After (your actual values):**
```env
RAZORPAY_KEY_ID=rzp_test_abc123xyz789
RAZORPAY_KEY_SECRET=abc123xyz789def456
PORT=5000
NODE_ENV=development
```

✅ Replace with YOUR actual keys from Step 1.3

### Step 2.5: Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
╔════════════════════════════════════════════════════════════╗
║     Online Book Store Backend - Razorpay Integration       ║
║     Server running on http://localhost:5000                    ║
╚════════════════════════════════════════════════════════════╝
Available Endpoints:
  • POST   http://localhost:5000/create-order
  • POST   http://localhost:5000/verify-payment
```

✅ **Backend is running! Keep this terminal open.**

---

## 💻 Step 3: Frontend Setup (5 min)

### Step 3.1: Open New Terminal

Open terminal in the **project root** (NOT in backend folder):

```bash
# Windows - Make sure you're in: C:\Users\ojasva koolwal\online-book-store
# Mac/Linux - Make sure you're in the online-book-store folder
pwd
```

### Step 3.2: Create Environment File

Create a file named `.env` (NOT `.env.example`) in the project root.

**Windows (PowerShell):**
```bash
echo REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxx > .env
echo REACT_APP_BACKEND_URL=http://localhost:5000 >> .env
```

**Mac/Linux:**
```bash
cat > .env << EOF
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxx
REACT_APP_BACKEND_URL=http://localhost:5000
EOF
```

**Or manually create `.env` file with this content:**
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_abc123xyz789
REACT_APP_BACKEND_URL=http://localhost:5000
```

✅ Replace `rzp_test_xxxxx` with YOUR actual Key ID from Step 1.3

### Step 3.3: Install Frontend Dependencies (Optional - Usually Already Installed)

```bash
npm install
```

**Note:** If you already have `node_modules` and `package-lock.json`, skip this step.

### Step 3.4: Start Frontend Server

```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view your app in the browser.

Local: http://localhost:3000
```

A browser window should automatically open to http://localhost:3000

✅ **Frontend is running!**

---

## 🧪 Step 4: Test the Payment Integration (2 min)

### Step 4.1: Open the App

The app should be open at http://localhost:3000 (if not, open it manually)

### Step 4.2: Add Items to Cart

1. Click on some books to add them to cart
2. Click cart button to see items
3. You should see a payment section below the books

### Step 4.3: Click Payment Button

1. Look for "Pay ₹XXX" button (amount depends on cart)
2. Click the button

**Expected:** Razorpay checkout modal opens

### Step 4.4: Use Test Card

Fill in the payment form:

```
Card Number:  4111 1111 1111 1111
Expiry Date:  12/25
CVV:          123
Name:         Your Name
Email:        test@example.com
Phone:        9999999999
```

Then click **"Pay Now"**

### Step 4.5: Check Success

**Expected results:**
- ✅ Payment modal closes
- ✅ "Payment successful!" message appears
- ✅ Order ID is shown
- ✅ Browser console shows no errors (F12 to check)
- ✅ Backend terminal shows "Payment verified" message

✅ **Payment integration working!**

---

## 🐛 Step 5: Troubleshooting

### Backend Won't Start

**Error:** `Cannot find module 'razorpay'`

**Fix:**
```bash
cd backend
npm install razorpay
```

**Error:** `RAZORPAY_KEY_ID is undefined`

**Fix:**
1. Check `.env` file exists (not `.env.example`)
2. Check `.env` has correct values
3. Restart server: `npm run dev`

---

### Frontend Shows Errors

**Error:** `Cannot find module 'PaymentButton'`

**Fix:**
1. Check file exists: `src/components/PaymentButton.js`
2. Check file exists: `src/components/PaymentButton.css`
3. Restart frontend: `npm start`

---

### CORS Error

**Error (in browser console):** `Access-Control-Allow-Origin` error

**Fix:**
1. Make sure backend is running on port 5000
2. Check frontend `.env` has: `REACT_APP_BACKEND_URL=http://localhost:5000`
3. Restart both servers

---

### Payment Modal Won't Open

**Error:** No modal appears when clicking Pay button

**Fix:**
1. Check browser console (F12)
2. Look for JavaScript errors
3. Check that `REACT_APP_RAZORPAY_KEY_ID` in `.env` starts with `rzp_test_`

---

### Payment Verification Fails

**Error:** "Payment verification failed"

**Fix:**
1. Check backend console for errors
2. Make sure you're using test key (not live key)
3. Make sure signature calculation is correct

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Both terminals show no error messages
- [ ] Payment button visible on website
- [ ] Can click payment button
- [ ] Razorpay modal opens
- [ ] Test payment succeeds
- [ ] Success message appears
- [ ] Backend shows "Payment verified"

---

## 📁 Final File Structure

After setup, your folder should look like:

```
online-book-store/
├── backend/
│   ├── .env                 ✓ Created (with YOUR keys)
│   ├── .env.example         ✓ Created
│   ├── server.js            ✓ Created
│   ├── package.json         ✓ Created
│   ├── README.md            ✓ Created
│   └── node_modules/        ✓ Created by npm install
│
├── src/
│   ├── components/
│   │   ├── PaymentButton.js     ✓ Created
│   │   ├── PaymentButton.css    ✓ Created
│   │   └── [other files]
│   └── ...
│
├── .env                     ✓ Created (with YOUR key ID)
├── package.json             ✓ Original
├── node_modules/            ✓ Original
├── PAYMENT_SETUP_GUIDE.md       ✓ Created
├── QUICK_START.md               ✓ Created
├── SETUP_CHECKLIST.md           ✓ Created
├── README_PAYMENT_INTEGRATION.md ✓ Created
└── ... other files
```

---

## 🎉 What You've Accomplished

✅ Backend Express server with Razorpay API
✅ Frontend React component for payments
✅ Payment creation endpoint
✅ Payment verification endpoint
✅ HMAC-SHA256 signature verification
✅ Complete error handling
✅ Environment variable management
✅ CORS enabled
✅ Test payment working

---

## 🚀 Next Steps

### 1. Explore the Code

- Read `backend/server.js` - Understand the API
- Read `src/components/PaymentButton.js` - Understand React component

### 2. Review Examples

- Check `INTEGRATION_EXAMPLES.js` for different use cases
- See how to:
  - Pass dynamic amounts
  - Handle success/failure
  - Save orders to database
  - Send emails
  - Create subscriptions

### 3. Customize

- Change payment amount
- Customize success message
- Add order confirmation email
- Save orders to database
- Add order tracking

### 4. Deploy to Production

When ready:
1. Get LIVE Razorpay keys (not test keys)
2. Deploy backend (Heroku, AWS, etc.)
3. Deploy frontend (Vercel, Netlify, etc.)
4. Update environment variables
5. Update CORS settings

---

## 📚 Documentation Files

For detailed information, see:

| File | Purpose |
|------|---------|
| `QUICK_START.md` | Quick 5-minute reference |
| `PAYMENT_SETUP_GUIDE.md` | Detailed comprehensive guide |
| `SETUP_CHECKLIST.md` | Verification checklist |
| `INTEGRATION_EXAMPLES.js` | Code examples for various scenarios |
| `README_PAYMENT_INTEGRATION.md` | Overview and features |
| `backend/README.md` | Backend API documentation |
| `FILES_SUMMARY.md` | Summary of all files |
| `MASTER_INSTALLATION_GUIDE.md` | This file |

---

## 💡 Tips

1. **Keep terminals running:** Don't close the terminal windows while testing
2. **Test first:** Always test with test keys before using live keys
3. **Read errors:** Console errors are helpful - read them carefully
4. **Save keys safely:** Don't expose your secret key anywhere
5. **Use .env:** Store secrets in .env, not in code

---

## 🆘 Need Help?

1. **Check console:** Open F12 in browser to see errors
2. **Check backend logs:** Look at terminal running backend
3. **Read docs:** Check `PAYMENT_SETUP_GUIDE.md` troubleshooting
4. **Review code:** Comments in code explain what's happening
5. **Check examples:** See `INTEGRATION_EXAMPLES.js` for patterns

---

## ✨ Congrats!

You have successfully set up complete Razorpay payment integration for your Online Book Store!

Your app can now:
- ✅ Accept payments
- ✅ Verify transactions
- ✅ Handle errors
- ✅ Show user feedback
- ✅ Store transaction details

---

**You're ready to accept real payments!** 🎉

(Just upgrade to live keys when ready for production)

---

**Questions? Check the documentation files or review the code comments.**

**Happy Coding! 🚀**
