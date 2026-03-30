# Frontend Environment Configuration - REFERENCE

## .env File (Root Directory)

Location: `c:\Users\ojasva koolwal\online-book-store\.env`

```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
REACT_APP_BACKEND_URL=https://online-book-store-ce1n.onrender.com
```

**IMPORTANT NOTES:**
- This file is in `.gitignore` (never committed to GitHub)
- In Vercel, use the UI to set these environment variables
- For different environments, you can have:
  - `.env` (committed - defaults)
  - `.env.local` (NOT committed - local overrides)
  - `.env.production` (committed - production defaults)
  - `.env.development` (committed - dev defaults)

## Environment Variables for Different Stages

### Development (Local)

`.env` or `.env.development`:
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Production (Vercel)

Set in Vercel Dashboard → Settings → Environment Variables:

| Name | Value | Environments |
|------|-------|---|
| REACT_APP_RAZORPAY_KEY_ID | rzp_live_SUahG6dlANgZ71 | Production, Preview |
| REACT_APP_BACKEND_URL | https://online-book-store-ce1n.onrender.com | Production, Preview |

## How CartDrawer.js Uses Environment Variables

```javascript
// Read backend URL from environment variable
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Create order API call
fetch(`${BACKEND_URL}/create-order`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: Math.round(total * 100),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  }),
});

// Verify payment API call
fetch(`${BACKEND_URL}/verify-payment`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
  }),
});
```

## Razorpay Public Key Variable

```javascript
// Used to initialize Razorpay checkout
const options = {
  key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Public Key
  // ... other options
};
```

⚠️ **IMPORTANT:** This is the PUBLIC key - it's safe to expose in frontend code. The SECRET key must NEVER be in frontend code.

## How to Update Environment Variables in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select **online-book-store** project
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - Name: `REACT_APP_RAZORPAY_KEY_ID`
   - Value: `rzp_live_SUahG6dlANgZ71`
6. Select Environments: `Production`, `Preview`, `Development`
7. Click **Save**
8. Repeat for `REACT_APP_BACKEND_URL`

After adding/changing environment variables in Vercel:
- Click **Deployments** tab
- Click **Redeploy** on latest deployment, OR
- Push a new commit to main branch to trigger automatic redeploy

## Testing Environment Variables Locally

```powershell
# Terminal 1: Start backend (change to backend directory)
cd backend
npm run dev

# Terminal 2: Run React with custom env var
# Windows PowerShell:
$env:REACT_APP_BACKEND_URL="http://localhost:5000"
npm start

# Or create .env.local for permanent local override
# .env.local (NOT COMMITTED):
# REACT_APP_BACKEND_URL=http://localhost:5000
```

## Error: Environment Variables Not Showing in Build

If variables seem not to work after deployment:

1. **Vercel not seeing changes?**
   - Go to Deployments → Click latest → Check "Build Logs"
   - Verify variables are listed in logs
   - Redeploy by pushing new commit

2. **Frontend still using old URL?**
   - Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear browser cache
   - Check that `.env` has been committed to Git

3. **Verify variable is set:**
   ```javascript
   // Add to CartDrawer.js temporarily to debug
   console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
   console.log('Razorpay Key:', process.env.REACT_APP_RAZORPAY_KEY_ID);
   ```

## Common Mistakes to Avoid

❌ **Wrong:**
```javascript
const BACKEND_URL = 'http://localhost:5000'; // Hard-coded!
```

✅ **Right:**
```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
```

❌ **Wrong:**
```
BACKEND_URL=http://localhost:5000 // Missing REACT_APP_ prefix!
```

✅ **Right:**
```
REACT_APP_BACKEND_URL=http://localhost:5000 // Has REACT_APP_ prefix
```

❌ **Wrong:**
```javascript
const SECRET_KEY = process.env.RAZORPAY_KEY_SECRET; // Never expose secret in frontend!
```

✅ **Right:**
```javascript
const PUBLIC_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID; // Public key only
// SECRET key stays only on backend!
```

## Reference: Why REACT_APP_ Prefix?

Create React App (CRA) automatically injects variables with `REACT_APP_` prefix into the build.

- ✅ `process.env.REACT_APP_SOMETHING` → Available in frontend
- ❌ `process.env.SOMETHING` → NOT available in frontend (returns undefined)

This is a security feature - prevents accidental exposure of backend-only variables.
