# Production Deployment Guide - Online Book Store

## 📋 Overview

This guide walks through deploying your Razorpay-integrated Online Book Store to production:
- **Backend**: Render (formerly Heroku alternative)
- **Frontend**: Vercel (already configured)

## ✅ What's Been Updated

### Backend Changes
✓ CORS configured for both localhost and Vercel domains  
✓ Environment variables properly validated  
✓ PORT configuration for Render  
✓ Improved error handling and logging  

### Frontend Changes
✓ Backend URL updated to production Render URL  
✓ Enhanced error handling with detailed console logging  
✓ Environment variables properly configured  

---

## 🚀 Step 1: Deploy Backend to Render

### 1.1 Create Render Account & Project

1. Go to [render.com](https://render.com)
2. Sign up (or login if you have an account)
3. Click **"New"** → **"Web Service"**
4. Choose **"Deploy an existing Git repository"**
5. Click **"Connect account"** to authenticate GitHub

### 1.2 Connect Your Repository

1. Search for **`online-book-store`** repository
2. Click **"Connect"**
3. Set name: `online-book-store-backend`
4. Set region: **US East** (or closest to you)
5. Set Branch: **main**
6. Set Root Directory: **backend** (IMPORTANT!)

### 1.3 Configure Build & Start Commands

In the Render dashboard:

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### 1.4 Add Environment Variables

In Render dashboard → **"Environment"** tab:

```
RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
RAZORPAY_KEY_SECRET=93vJIjIKwJwivwewAWlymCHj
NODE_ENV=production
```

⚠️ **SECURITY WARNING**: Replace these with your actual Razorpay production keys!

### 1.5 Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy from your Git repository
3. Wait for deployment to complete (check logs)
4. Note your backend URL (should be: `https://online-book-store-ce1n.onrender.com`)

### 1.6 Verify Backend is Working

Test your backend:
```
curl https://online-book-store-ce1n.onrender.com/
```

You should see:
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

---

## 🌐 Step 2: Update & Redeploy Frontend on Vercel

### 2.1 Verify Environment Variables

Your `.env` file already has:
```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
REACT_APP_BACKEND_URL=https://online-book-store-ce1n.onrender.com
```

### 2.2 Test Locally First (Optional)

```powershell
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend with production URL
$env:REACT_APP_BACKEND_URL="https://online-book-store-ce1n.onrender.com"
npm start
```

### 2.3 Commit and Push Changes

```powershell
git add .
git commit -m "Fix: Configure production deployment URLs and CORS"
git push origin main
```

### 2.4 Vercel Automatic Deployment

✅ Vercel automatically deploys when you push to `main`

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select **online-book-store** project
3. Click **"Deployments"** tab
4. Wait for latest deployment to complete
5. Visit: `https://online-book-store-pied.vercel.app`

### 2.5 Set Production Environment Variables (If Needed)

If environment variables aren't already set in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - Name: `REACT_APP_RAZORPAY_KEY_ID`
   - Value: `rzp_live_SUahG6dlANgZ71`
   - Environments: Production, Preview, Development

3. Add:
   - Name: `REACT_APP_BACKEND_URL`
   - Value: `https://online-book-store-ce1n.onrender.com`
   - Environments: Production

4. Click **"Save"**
5. Trigger a redeploy (any push to main will do)

---

## 🧪 Step 3: Test Payment Flow in Production

### 3.1 Access Your Live Site
```
https://online-book-store-pied.vercel.app
```

### 3.2 Test Payment (Using Test Cards)

**NOT RECOMMENDED:** Using live keys with test cards still risks charges.  
**RECOMMENDED:** Use Razorpay Test Mode instead (see below)

### 3.3 Switch to Razorpay Test Mode (RECOMMENDED)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Click **"Settings"** → **"API Keys"**
3. Toggle **"Test Mode"** (right side)
4. Copy the **test mode** keys:
   - Test Key ID (starts with `rzp_test_`)
   - Test Key Secret

5. Update environment variables:

**Render backend `.env`:**
```
RAZORPAY_KEY_ID=rzp_test_<your_test_key>
RAZORPAY_KEY_SECRET=<your_test_secret>
```

**Vercel frontend `.env`:**
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_<your_test_key>
```

6. **Render:** Push changes to trigger automatic redeploy
7. **Vercel:** Push changes to trigger automatic redeploy

### 3.4 Test with Test Card

Once in test mode:

1. Add books to cart
2. Click **Checkout**
3. Razorpay popup opens
4. Use test card: **4111 1111 1111 1111**
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3-digit number (e.g., 123)
   - Name: Any name
5. Complete payment
6. ✓ Should see success message

### 3.5 Monitor Payment in Console

**Browser Console (F12):**
```
✓ Razorpay script loaded successfully
📦 Creating order with amount: 5000 paise
✓ Order created: {...}
💳 Opening Razorpay checkout...
✓ Payment completed, verifying signature...
✓ Verification response: {...}
✓✓ Payment verified successfully!
```

**Backend Logs (Render):**
Visit Render dashboard → Logs to see:
```
✓ Razorpay initialized successfully
✓ Environment: production
✓ Order created: order_XXXXXXX
✓ Payment verified
```

---

## 🔒 Security Checklist

- [ ] Never commit `.env` files with real secrets
- [ ] Use Render's environment variable UI for secrets
- [ ] Use Vercel's environment variable UI for frontend keys  
- [ ] CORS is restricted to approved domains only
- [ ] No `cors()` without origin validation
- [ ] Test mode keys used for development
- [ ] Live keys only used in production with proper monitoring
- [ ] Error messages don't expose sensitive information
- [ ] Signature verification happens on backend, not frontend

---

## 📊 Common Issues & Solutions

### Issue: "CORS error - origin not allowed"
**Solution:** Add your Vercel domain to backend CORS whitelist in `server.js`
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://online-book-store-pied.vercel.app', // Your Vercel domain
];
```

### Issue: "Razorpay script failed to load"
**Solution:** Check browser console (F12)
- Clear browser cache
- Check internet connection
- Restart browser

### Issue: "Payment created but verification fails"
**Solution:** 
1. Check backend logs in Render
2. Verify environment variables are set correctly
3. Ensure keys match between environments

### Issue: "404 Backend not found"
**Solution:**
1. Verify Render deployment completed successfully
2. Check Render URL in `.env` matches your actual Render URL
3. Test backend directly: `curl https://your-url.onrender.com/`

### Issue: Render app goes to sleep
**Solution:** Render free tier apps sleep after 15 mins of inactivity
- Upgrade to **Pro** ($7/month) for always-on, or
- Implement a wake-up script to ping the app every 14 minutes

---

## 📝 Final Verification

Run this checklist after deployment:

```
✓ Backend deployed to Render
✓ Frontend deployed to Vercel  
✓ Environment variables set in both platforms
✓ CORS allows both localhost and Vercel domain
✓ Test payment flow end-to-end
✓ Success message appears after payment
✓ Browser console shows success logs
✓ Backend logs show verification success
✓ Cart clears after successful payment
✓ Refresh doesn't break the flow
```

---

## 🎯 Next Steps

After successful payment testing:

1. **Database Integration**: Store orders in MongoDB/PostgreSQL
2. **Email Notifications**: Send confirmation emails to customers
3. **Admin Dashboard**: Track orders and payments
4. **Webhook Implementation**: Razorpay webhooks for real-time updates
5. **Analytics**: Track conversion rates and payment metrics

---

## 📞 Support

If you encounter issues:

1. **Check Console Logs**: F12 → Console tab for frontend
2. **Check Render Logs**: Dashboard → Logs for backend
3. **Check Network Tab**: F12 → Network for API calls
4. **Verify URLs**: Make sure URLs don't have typos
5. **Clear Cache**: Browser cache can cause stale code

---

**Last Updated:** March 26, 2026  
**Status:** Production Ready ✅
