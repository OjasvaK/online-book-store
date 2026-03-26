# Terminal Commands - Quick Reference

## Push Code to GitHub

Run these commands in your project directory:

```powershell
# Check what files changed
git status

# Add all changes
git add .

# Commit changes
git commit -m "Fix: Production deployment configuration - CORS, env vars, error handling"

# Push to GitHub (triggers Vercel deployment)
git push origin main
```

**Expected Output:**
```
[main xxxxxxx] Fix: Production deployment configuration
 3 files changed, XXX insertions(+), XXX deletions(-)
```

Then in Vercel dashboard, you'll see deployment starting automatically.

---

## Verify Backend (Before Deployment to Render)

Test your backend locally to ensure it works:

```powershell
# Terminal 1: Start backend
cd backend
npm run dev

# Should see:
# ╔════════════════════════════════════════════════════════════╗
# ║     Online Book Store Backend - Razorpay Integration       ║
# ║     Server running on http://localhost:5000                ║
# ╚════════════════════════════════════════════════════════════╝
```

In another terminal, test the endpoint:

```powershell
# Terminal 2: Test health check
curl http://localhost:5000/

# Should return JSON with endpoints
```

---

## Start Frontend Locally (For Testing)

```powershell
# Terminal (separate from backend)
cd online-book-store

# Set backend URL to localhost (optional, already in .env)
npm start

# Should compile and open http://localhost:3000 or http://localhost:3001
```

---

## Deploy Backend to Render

These steps are done through **Render Dashboard** (not terminal):

1. Visit: https://render.com
2. Sign up/Login
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure settings in the UI
6. Click "Create Web Service"

**No terminal commands needed for Render deployment** - it watches your GitHub automatically.

---

## After Render Deployment

Once backend is deployed to Render, test it:

```powershell
# Replace YOUR_RENDER_URL with your actual render URL
curl https://your-render-url.onrender.com/

# Should return:
# {
#   "message": "Online Book Store Backend - Payment Integration API",
#   "version": "1.0.0",
#   "endpoints": {...}
# }
```

---

## Useful Git Commands

### Check current status
```powershell
git status
```

### See recent commits
```powershell
git log --oneline -10
```

### Undo last commit (if needed)
```powershell
git reset --soft HEAD~1
```

### See what changed
```powershell
git diff
```

### Discard local changes
```powershell
git checkout -- .
```

---

## npm Commands

### Install dependencies
```powershell
npm install
```

### Start development server
```powershell
npm start
```

### Run backend in development mode (with nodemon)
```powershell
cd backend
npm run dev
```

### Start production server
```powershell
npm start
```

---

## Environment Variable Testing (Local)

### Test frontend with custom backend URL
```powershell
# PowerShell
$env:REACT_APP_BACKEND_URL="http://localhost:5000"
npm start

# Or create .env.local with:
# REACT_APP_BACKEND_URL=http://localhost:5000
```

### View all environment variables
```powershell
# PowerShell - show all env vars
Get-ChildItem env:REACT_APP*
```

---

## Browser Console Commands (F12)

After opening payment modal, you can test in console:

```javascript
// Check if backend URL is correct
console.log(process.env.REACT_APP_BACKEND_URL)

// Check if public key is set
console.log(process.env.REACT_APP_RAZORPAY_KEY_ID)

// Test API call manually
fetch(process.env.REACT_APP_BACKEND_URL + '/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 50000, currency: 'INR' })
}).then(r => r.json()).then(d => console.log(d))
```

---

## Troubleshooting Commands

### Check if backend is running
```powershell
# Test localhost backend
curl http://localhost:5000/

# Test Render backend
curl https://online-book-store-iru0.onrender.com/
```

### Check git configuration
```powershell
git config --list
```

### Clear npm cache (if install fails)
```powershell
npm cache clean --force
npm install
```

### Kill process on port 5000 (if stuck)
```powershell
# PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

---

## Complete Deployment Script

Copy and run in sequence:

```powershell
# 1. Check status
git status

# 2. Add changes
git add .

# 3. Commit
git commit -m "Fix: Production deployment configuration"

# 4. Push (Vercel auto-deploys)
git push origin main

# 5. Verify backend URL in .env
type .env

# 6. Check you're still in project root
pwd  # or cd path\to\online-book-store

# Done! 
# Next: Deploy backend to Render (via website)
# Then: Test payment at https://online-book-store-pied.vercel.app
```

---

## Verifying Deployment Success

### Check Git Push
```powershell
# Should show new commits
git log --oneline -3
```

### Check Vercel Deployment
- Go to: https://vercel.com/dashboard
- Select: online-book-store project
- Check: Latest deployment status (should show "Ready")

### Check Render Deployment
- Go to: https://dashboard.render.com
- Select: online-book-store-backend service
- Check: Latest deployment logs (should show "Service is live")

---

## Common Command Issues

### Command not found: npm
**Solution:** Install Node.js from nodejs.org

### Command not found: git
**Solution:** Install Git from git-scm.com

### "Permission denied" on Mac/Linux
**Solution:** Add `sudo` or fix permissions:
```bash
sudo npm install
# or
chmod +x node_modules/.bin/*
```

### CORS error in console
**Not a terminal issue** - backend domain missing from CORS whitelist

### Build fails on Vercel
**Solution:** Check Vercel logs in deployment details

---

## Files to Edit to Test

All important files are already updated! But if you need to make changes:

```powershell
# Edit backend server
code backend/server.js

# Edit frontend component
code src/components/CartDrawer.js

# Edit environment variables
code .env

# View backend environment
code backend/.env
```

---

## Final Deployment Checklist Commands

```powershell
# 1. Verify backend code is good
cd backend
npm run dev  # Start, wait for startup, then Ctrl+C

# 2. Verify frontend code compiles
cd ..
npm install  # If needed
npm start    # Wait for startup, then check browser, then Ctrl+C

# 3. Check env file
cat .env

# 4. Check git status
git status

# 5. Push code
git add .
git commit -m "Fix: Production deployment configuration"
git push origin main

# 6. Then deploy backend to Render (via website)
# 7. Then test at https://online-book-store-pied.vercel.app
```

---

**Remember:** After pushing to GitHub, Vercel auto-deploys. You only need to manually deploy the backend to Render through their dashboard.

**Questions about a command?** Check the comments above or read the main guides.
