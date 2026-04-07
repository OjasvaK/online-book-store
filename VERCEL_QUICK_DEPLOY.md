# ⚡ VERCEL DEPLOYMENT - QUICK START

Get your Online Book Store live on Vercel in 5 minutes!

## 🎯 Quick Steps

### Step 1: Commit Everything ✅
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Go to Vercel ✅
Visit: https://vercel.com/dashboard

### Step 3: Import Project ✅
1. Click **Add New** → **Project**
2. Select **online-book-store** repository
3. Click **Import**

### Step 4: Add Environment Variables ✅

In Vercel Dashboard, go to **Settings** → **Environment Variables** and add:

```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
REACT_APP_BACKEND_URL=https://online-book-store-ce1n.onrender.com
```

Set for: **Production** and **Preview**

### Step 5: Deploy ✅
1. Click **Deploy**
2. Wait 2-5 minutes
3. ✨ Your site is live!

---

## 🔗 Your Live URLs

| Environment | URL |
|---|---|
| **Production** | `https://online-book-store-pied.vercel.app` |
| **Dashboard** | `https://vercel.com/dashboard` |
| **Repo** | `https://github.com/your-username/online-book-store` |

---

## ✅ Testing Checklist

- [ ] Homepage loads
- [ ] Can add books to cart
- [ ] Cart button opens drawer
- [ ] Cart displays items correctly
- [ ] Search functionality works
- [ ] Category filter works
- [ ] No console errors (F12)
- [ ] Backend API responds

---

## 📁 What Gets Deployed

```
online-book-store/
├── src/                    ✅ React app
├── public/                 ✅ Static assets
├── package.json           ✅ Dependencies
├── vercel.json            ✅ Vercel config (NEW)
├── .env.production        ✅ Prod defaults (NEW)
└── .gitignore            ✅ Excludes .env files
```

**NOT deployed:**
- `backend/` (deployed separately to Render)
- `node_modules/` (installed fresh)
- `.env`, `.env.local` (sensitive, not committed)

---

## 🔄 Auto-Deployment

After this initial setup:
- **Every push to `main`** → Auto-deploys
- **Pull requests** → Preview deployments
- **No manual deployment needed!**

---

## 🐛 Having Issues?

### API calls not working?
→ Check `REACT_APP_BACKEND_URL` in Vercel Settings

### Cart not opening?
→ Make sure you deployed the latest code with the CartDrawer fix

### Environment variables not updating?
→ Trigger redeploy: Deployments → Select deployment → Redeploy

### Backend returning 404?
→ Check backend is running: https://online-book-store-ce1n.onrender.com/

---

## 📖 More Help

Full guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

**🎉 Your app is now production-ready on Vercel!**
