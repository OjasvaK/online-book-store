# Production Deployment Checklist

## 🔧 Code Updates - COMPLETED ✅

- [x] Backend server.js updated with production CORS
- [x] Environment variables configured
- [x] Frontend .env updated with production URL
- [x] Error handling enhanced with logging
- [x] package.json has correct start script

## 🚀 Deployment Steps - TODO

### Backend (Render) Deployment

- [ ] **Step 1**: Create Render account at render.com
- [ ] **Step 2**: Create new Web Service
- [ ] **Step 3**: Connect GitHub repository
- [ ] **Step 4**: Set Root Directory to: `backend`
- [ ] **Step 5**: Add Environment Variables:
  - `RAZORPAY_KEY_ID` = your live key
  - `RAZORPAY_KEY_SECRET` = your live secret
  - `NODE_ENV` = production
- [ ] **Step 6**: Deploy (wait for completion)
- [ ] **Step 7**: Note your Render URL (e.g., `https://online-book-store-iru0.onrender.com`)
- [ ] **Step 8**: Test backend with curl:
  ```
  curl https://your-render-url.onrender.com/
  ```

### Frontend (Vercel) Redeployment

- [ ] **Step 1**: Verify `.env` has production backend URL
- [ ] **Step 2**: Commit changes:
  ```
  git add .
  git commit -m "Fix: Production deployment configuration"
  ```
- [ ] **Step 3**: Push to GitHub:
  ```
  git push origin main
  ```
- [ ] **Step 4**: Vercel auto-deploys (wait 2-5 minutes)
- [ ] **Step 5**: Visit your live site at `https://online-book-store-pied.vercel.app`

## 🧪 Testing - POST DEPLOYMENT

- [ ] Can access backend root endpoint
- [ ] Can access frontend site
- [ ] Can add books to cart
- [ ] Can open cart drawer
- [ ] Can see checkout button
- [ ] Can click checkout
- [ ] Razorpay popup opens
- [ ] Can complete test payment
- [ ] See success message
- [ ] Cart clears after payment
- [ ] No CORS errors in console
- [ ] No 404 errors in console
- [ ] Backend logs show order creation
- [ ] Backend logs show payment verification

## 📊 Environment Variables Checklist

### Backend (.env in backend/ folder on Render)

```
RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
RAZORPAY_KEY_SECRET=93vJIjIKwJwivwewAWlymCHj
NODE_ENV=production
PORT=5000 (optional - Render sets this automatically)
```

### Frontend (.env in root folder - already updated)

```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
REACT_APP_BACKEND_URL=https://online-book-store-iru0.onrender.com
```

## 🔐 Security Review

- [ ] Razorpay keys are NOT in Git (in .env which is in .gitignore)
- [ ] Sensitive env vars are set in Render dashboard UI
- [ ] CORS is restricted (not allowing all origins)
- [ ] Signature verification happens on backend
- [ ] Error messages don't expose secrets
- [ ] Using HTTPS for all external URLs

## 🐛 Troubleshooting

If something doesn't work:

1. **Check Render Logs**
   - Render dashboard → Select app → Logs tab
   - Look for errors during startup

2. **Check Vercel Logs**
   - Vercel dashboard → Select app → Deployments tab
   - Click latest deployment → Logs

3. **Check Browser Console**
   - F12 → Console tab
   - Look for error messages

4. **Check Network Errors**
   - F12 → Network tab
   - Click on failed request
   - Check response details

5. **Common Fixes**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)
   - Check URLs for typos
   - Verify env vars are set
   - Ensure backend domain is correct

## 📝 Important Notes

- **Render Free Tier**: Apps sleep after 15 minutes of inactivity
  - Upgrade to Pro for always-on deployment
  - Or implement a ping script every 14 minutes

- **First Deploy**: May take 2-5 minutes to complete
  - Be patient, don't refresh repeatedly

- **Environment Variables**: Changes on Render require manual redeploy
  - Push a change to trigger automatic redeploy, or
  - Click "Manual Deploy" in Render dashboard

- **CORS Issues**: If frontend can't reach backend
  - Check Vercel domain is in backend CORS whitelist
  - Check backend URL in frontend .env matches Render URL

## ✨ Success Indicators

When everything works correctly, you should see:

**In Browser Console (F12 → Console):**
```
✓ Razorpay script loaded successfully
📦 Creating order with amount: XXXXX paise
✓ Order created: {...}
💳 Opening Razorpay checkout...
✓ Payment completed, verifying signature...
✓✓ Payment verified successfully!
```

**In Render Logs:**
```
✓ Razorpay initialized successfully
✓ Environment: production
[Details of order creation and verification]
```

**In Browser:**
- Green success message appears
- Cart empties after 3 seconds
- Modal closes

---

## 🎯 Action Items Summary

1. **Create Render account** (if not already done)
2. **Deploy backend** to Render
3. **Push frontend changes** to GitHub (auto-deploys to Vercel)
4. **Set environment variables** in Render
5. **Test payment flow** end-to-end
6. **Monitor logs** during first payment

Once all checkboxes are marked ✅, your production deployment is complete!

---

**Need the complete backend code reference?** → See `BACKEND_REFERENCE.md`  
**Need detailed deployment guide?** → See `PRODUCTION_DEPLOYMENT_GUIDE.md`
