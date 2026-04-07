# 📚 DEPLOYMENT DOCUMENTATION INDEX

Complete guide to deploying Online Book Store - Frontend on Vercel & Backend on Render

---

## 🚀 QUICK START (5 Minutes)

→ See: **[VERCEL_QUICK_DEPLOY.md](./VERCEL_QUICK_DEPLOY.md)**

Steps:
1. Commit code and push to GitHub
2. Go to vercel.com/dashboard
3. Import repository
4. Add environment variables
5. Deploy ✨

---

## 📖 COMPLETE GUIDES

### Frontend Deployment (Vercel)

| Document | Purpose |
|----------|---------|
| [VERCEL_QUICK_DEPLOY.md](./VERCEL_QUICK_DEPLOY.md) | 5-minute quick start |
| [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) | Complete step-by-step guide |
| [ENVIRONMENT_VARIABLES_GUIDE.md](./ENVIRONMENT_VARIABLES_GUIDE.md) | Environment variable setup |

### Backend Deployment (Render)

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Backend deployment checklist |
| [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md) | Complete deployment workflow |
| [backend/.env.example](./backend/.env.example) | Backend environment template |

### Reference Documentation

| Document | Purpose |
|----------|---------|
| [BACKEND_REFERENCE.md](./BACKEND_REFERENCE.md) | Backend architecture & API |
| [PAYMENT_SETUP_GUIDE.md](./PAYMENT_SETUP_GUIDE.md) | Razorpay configuration |
| [README_PRODUCTION_READY.md](./README_PRODUCTION_READY.md) | Production-ready checklist |

---

## 🏗️ DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│            online-book-store (main branch)              │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────────┐      ┌──────────────┐
   │   Vercel    │      │    Render    │
   │ (Frontend)  │      │  (Backend)   │
   └─────────────┘      └──────────────┘
        │                     │
        ▼                     ▼
   React App           Node.js Express
   (Production)        + Razorpay
   
   URL:                URL:
   online-book-       online-book-
   store-pied.        store-ce1n.
   vercel.app        onrender.com
```

---

## 📋 DEPLOYMENT CHECKLIST

### ✅ Before Deployment

Frontend:
- [ ] All code changes committed
- [ ] `.env` file in `.gitignore`
- [ ] `vercel.json` in root directory
- [ ] `package.json` has build script
- [ ] No console/build errors locally

Backend:
- [ ] Deployed on Render (or other service)
- [ ] Environment variables set on Render
- [ ] Backend responds to requests
- [ ] CORS configured for Vercel URL

### ✅ During Deployment (Vercel)

- [ ] GitHub account linked
- [ ] Repository imported
- [ ] Root directory: `.` (default)
- [ ] Framework: Create React App (auto-detected)
- [ ] Environment variables added:
  ```
  REACT_APP_RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
  REACT_APP_BACKEND_URL=https://online-book-store-ce1n.onrender.com
  ```
- [ ] Deploy button clicked
- [ ] Build completes successfully

### ✅ After Deployment

- [ ] Site loads without errors
- [ ] Homepage renders correctly
- [ ] Cart opens when button clicked
- [ ] Books can be added to cart
- [ ] Cart displays prices correctly
- [ ] Search and filters work
- [ ] No mixed content warnings
- [ ] Payment flow works (test checkout)

---

## 🔗 CURRENT DEPLOYMENT URLS

| Service | URL | Status |
|---------|-----|--------|
| Frontend (Vercel) | https://online-book-store-pied.vercel.app | ✅ Ready |
| Backend (Render) | https://online-book-store-ce1n.onrender.com | ✅ Active |
| GitHub Repo | https://github.com/your-username/online-book-store | ✅ Updated |

---

## 🔐 ENVIRONMENT VARIABLES

### Production (Vercel)

Set in Vercel Dashboard:
```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
REACT_APP_BACKEND_URL=https://online-book-store-ce1n.onrender.com
```

### Development (Local)

In `.env.local`:
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Backend (Render)

Set in Render Dashboard:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NODE_ENV=production
```

---

## 🚀 DEPLOYMENT PROCESS

### 1. Local Development
```bash
npm install
npm start          # localhost:3000
```

### 2. Testing
- Test all features locally
- Test with test Razorpay keys
- Run: `npm run build` to verify production build

### 3. Push to GitHub
```bash
git add .
git commit -m "Release: Ready for production"
git push origin main
```

### 4. Frontend → Vercel
- Vercel auto-deploys on push to main
- Takes 2-5 minutes
- [View Deployments](https://vercel.com/dashboard/online-book-store)

### 5. Backend → Render (if needed)
- Manual push to Render
- Or configure auto-deploy
- [View Backend](https://dashboard.render.com)

### 6. Monitor & Test
- Visit https://online-book-store-pied.vercel.app
- Test all features
- Check DevTools console (F12)
- Monitor logs in Vercel Dashboard

---

## 📊 DEPLOYMENT MONITORING

### Vercel Dashboard

Track deployments:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select **online-book-store**
3. View **Deployments** tab
4. Check **Logs** for build/runtime issues

### Render Dashboard

Track backend:
1. Go to [render.com](https://render.com)
2. Select **online-book-store-backend**
3. View **Logs** for errors
4. Check **Metrics** for performance

---

## 🔄 CONTINUOUS DEPLOYMENT

After initial setup:

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. **Vercel auto-deploys** (2-5 mins)

3. **Verify at live URL**
   ```
   https://online-book-store-pied.vercel.app
   ```

No manual deployment needed!

---

## ⚡ QUICK COMMANDS

```bash
# Local development
npm install
npm start

# Production build test
npm run build
npm run build      # Test production build locally

# Deploy
git add .
git commit -m "message"
git push origin main    # Auto-deploys to Vercel

# View logs
# Vercel: Dashboard → Deployments → Logs
# Render: Dashboard → Logs
```

---

## 🐛 TROUBLESHOOTING

| Issue | Cause | Solution |
|-------|-------|----------|
| Frontend loads, but no styling | CSS not loading | Check build output in Vercel logs |
| Cart doesn't open | Wrong CSS classes | Deploy latest code with CartDrawer fix |
| API calls fail (404) | Backend URL wrong | Update REACT_APP_BACKEND_URL in Vercel |
| Payment modal doesn't show | Razorpay key missing/wrong | Verify key in Vercel environment variables |
| CORS errors | Backend CORS config | Update backend allowedOrigins array |

See: [VERCEL_DEPLOYMENT.md - Troubleshooting](./VERCEL_DEPLOYMENT.md#troubleshooting)

---

## 📚 HELPFUL LINKS

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **React Deployment**: https://vercel.com/docs/frameworks/react
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Custom Domains**: https://vercel.com/docs/concepts/projects/domains

---

## ✨ NEXT STEPS

1. **Review**: Read [VERCEL_QUICK_DEPLOY.md](./VERCEL_QUICK_DEPLOY.md)
2. **Prepare**: Commit code and push to GitHub
3. **Deploy**: Follow 5 steps in Vercel
4. **Test**: Verify everything works
5. **Monitor**: Check logs in dashboards

---

**Your app is ready for production! Deploy now 🎉**
