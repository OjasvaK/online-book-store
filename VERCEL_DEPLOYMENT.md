# 🚀 Vercel Deployment Guide - Online Book Store

Complete step-by-step guide to deploy your React app on Vercel.

---

## ✅ Pre-Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] Backend is deployed and running (e.g., on Render)
- [ ] Backend URL is working: Test with `curl https://your-backend-url.onrender.com/`
- [ ] All code changes are committed to Git
- [ ] `.env` files are in `.gitignore` (they should be)
- [ ] `vercel.json` is in the root directory
- [ ] GitHub repository is up to date

---

## 📋 Step 1: Prepare Your Code

### 1.1 Update Environment Variables

Check that your `.env` files are correct:

**`.env.local`** (Local development - NOT committed):
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
REACT_APP_BACKEND_URL=http://localhost:5000
```

**`.env.production`** (Production defaults - CAN be committed):
```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
REACT_APP_BACKEND_URL=https://online-book-store-ce1n.onrender.com
```

### 1.2 Commit Your Changes

```bash
git add .
git commit -m "chore: Prepare for Vercel deployment"
git push origin main
```

---

## 🌐 Step 2: Create Vercel Account

1. Go to **[vercel.com](https://vercel.com)**
2. Click **Sign Up**
3. Choose **Sign up with GitHub** (recommended)
4. Authorize Vercel to access your GitHub
5. Complete the setup

---

## 📦 Step 3: Deploy on Vercel

### 3.1 Create New Project

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click **Add New** → **Project**
3. Select your GitHub repository: **online-book-store**
4. Click **Import**

### 3.2 Configure Project Settings

**Root Directory:**
- Leave as `.` (root)

**Framework Preset:**
- Select **Create React App** (or it auto-detects)

**Build Command:**
- Default is fine: `npm run build`

**Output Directory:**
- Default is fine: `build`

**Install Command:**
- Default is fine: `npm install`

**Environment Variables:**
- Add the following in the UI:

| Name | Value | Environments |
|------|-------|---|
| `REACT_APP_RAZORPAY_KEY_ID` | `rzp_live_SUahG6dlANgZ71` | Production, Preview |
| `REACT_APP_BACKEND_URL` | `https://online-book-store-ce1n.onrender.com` | Production, Preview |

![Vercel Env Vars Setup](docs/vercel-env-setup.png)

### 3.3 Deploy

1. Click **Deploy**
2. Wait for deployment to complete (2-5 minutes)
3. Your site will be live at: `https://online-book-store-pied.vercel.app`

---

## ✨ Step 4: Set Custom Domain (Optional)

### 4.1 Add Domain

1. Go to your **Vercel Project** → **Settings**
2. Click **Domains**
3. Enter your custom domain (e.g., `mybooks.com`)
4. Add DNS records as shown in Vercel

### 4.2 Verify Domain

- Once DNS is propagated, your site will be accessible at your custom domain

---

## 🧪 Step 5: Test Your Deployment

### 5.1 Frontend Tests

- [ ] **Home Page Loads**: Visit your live URL
- [ ] **Add to Cart**: Click "Add to Cart" on a book
- [ ] **Open Cart**: Click cart button - should slide in from right
- [ ] **Cart Items Display**: Items should show with prices
- [ ] **Search Works**: Search for books
- [ ] **Category Filter**: Select different categories
- [ ] **No Console Errors**: Open DevTools (F12) → Console tab - should be clean

### 5.2 Backend API Tests

Test API connectivity:

```bash
# Test backend health
curl https://online-book-store-ce1n.onrender.com/

# Test CORS (should work from your Vercel domain)
curl -X OPTIONS https://online-book-store-ce1n.onrender.com/create-order \
  -H "Origin: https://online-book-store-pied.vercel.app" \
  -H "Content-Type: application/json" \
  -v
```

### 5.3 Payment Flow Test

1. Add a book to cart
2. Open cart → **Proceed to Payment**
3. Razorpay modal should appear
4. Use test credentials:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
5. Payment should complete and cart should clear

---

## 🔄 Automatic Deployments

Vercel automatically deploys when:
- You push to `main` branch
- Pull requests are created (Preview deployments)

### To Manually Redeploy:

1. Go to **Vercel Dashboard** → Your Project
2. Click **Deployments**
3. Find the deployment you want
4. Click **⋮** (three dots) → **Redeploy**

---

## 📱 Environment-Specific Deployments

Vercel creates different deployments:

| Branch | Environment | URL |
|--------|---|---|
| `main` | Production | `https://online-book-store-pied.vercel.app` |
| `develop` (if configured) | Preview | `https://develop-xxx.vercel.app` |
| Pull Requests | Preview | `https://pr-number-xxx.vercel.app` |

---

## 🔍 Troubleshooting

### Issue: Backend API Returns 404

**Cause**: Backend URL is incorrect or backend is down

**Solution**:
1. Check backend is running: `curl https://your-backend-url.onrender.com/`
2. Update `REACT_APP_BACKEND_URL` in Vercel Settings
3. Trigger redeploy

### Issue: CORS Error

**Cause**: Backend CORS configuration doesn't include Vercel URL

**Solution**:
1. Update backend's `allowedOrigins` array to include your Vercel URL
2. Redeploy backend
3. Test again

### Issue: Cart Not Opening

**Cause**: CSS classes don't match component markup

**Solution**: Already fixed! Make sure you have the latest code

### Issue: Environment Variables Not Working

**Cause**: Variables not set in Vercel or not prefixed with `REACT_APP_`

**Solution**:
1. In Vercel Settings → Environment Variables
2. Verify `REACT_APP_` prefix
3. Check selected environments (Production, Preview)
4. Trigger redeploy

---

## 📊 Monitoring & Logs

### View Deployment Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **Deployments**
3. Select a deployment
4. View **Logs** tab

### View Function Logs

If using Vercel serverless functions:
1. Click **Functions** tab
2. Select a function
3. View real-time logs

---

## 🎯 Performance Tips

### 1. Enable Caching
- Vercel auto-caches static assets
- `vercel.json` includes cache settings for `/static`

### 2. Monitor Builds
- Each build should complete in < 2 minutes
- Check **Deployments** for build times

### 3. Optimize Images
- Use `next/image` (if upgrading to Next.js)
- Compress images before upload

---

## 🔐 Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] Razorpay Secret Key is NOT in code
- [ ] Razorpay Secret Key only on backend
- [ ] Backend CORS restricted to Vercel URL
- [ ] Backend validates all payment requests
- [ ] No sensitive data in Vercel logs

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **React Deployment**: https://vercel.com/docs/frameworks/react
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Custom Domains**: https://vercel.com/docs/concepts/projects/domains/add-a-domain
- **Troubleshooting**: https://vercel.com/support

---

## ❓ Frequently Asked Questions

**Q: Is Vercel free?**
A: Yes! Vercel offers a generous free tier for hobby projects.

**Q: Can I use a custom domain?**
A: Yes! Add it in Vercel Settings → Domains.

**Q: How often is my site redeployed?**
A: Only when you push to GitHub or manually trigger a redeploy.

**Q: Is my data safe?**
A: Yes. Vercel has enterprise-grade security and compliance certifications.

**Q: Can I rollback a deployment?**
A: Yes! Click on a previous deployment and select "Redeploy".

---

**🎉 Congratulations! Your app is live on Vercel!**

For support, reach out to Vercel: https://vercel.com/support
