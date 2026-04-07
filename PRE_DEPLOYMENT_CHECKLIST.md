# ✅ PRE-DEPLOYMENT TEST CHECKLIST

Complete checklist before deploying to Vercel. Test all features locally first!

---

## 🖥️ LOCAL ENVIRONMENT SETUP

### Prerequisites
```bash
npm install                 # Install dependencies
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx     # Set test key in .env.local
REACT_APP_BACKEND_URL=http://localhost:5000 # Set local backend URL
npm start                   # Start development server
```

Verify:
- [ ] App starts without errors
- [ ] No console errors (F12 → Console)
- [ ] App loads at http://localhost:3000

---

## 🎨 FRONTEND TESTS

### Header & Navigation
- [ ] Header displays "📚 BookStore" title
- [ ] Header has purple gradient background
- [ ] Cart button visible in header
- [ ] Cart count badge shows (0) initially

### Book Display
- [ ] Books load from data/books.js
- [ ] Books display with cover, title, author, price
- [ ] Each book has "Add to Cart" button
- [ ] Book cards are responsive (look good on mobile)

### Search Functionality
- [ ] Search box works
- [ ] Results filter in real-time
- [ ] Empty search shows all books
- [ ] Search is case-insensitive

### Category Filter
- [ ] "All Categories" shows all books
- [ ] Selecting category filters books
- [ ] Works together with search
- [ ] Can reset after filtering

### Add to Cart
- [ ] "Add to Cart" button responds to click
- [ ] Cart count updates when added
- [ ] Multiple adds of same book increase count
- [ ] Cart count badge displays correctly

---

## 🛒 CART DRAWER TESTS

### Open/Close Cart
- [ ] Cart button opens drawer
- [ ] Drawer slides in from right
- [ ] Drawer content visible
- [ ] Close button (✕) closes drawer
- [ ] Clicking outside drawer closes it
- [ ] Overlay appears when drawer open

### Cart Display
- [ ] Cart heading shows "Shopping Cart"
- [ ] Cart items display correctly
- [ ] Each item shows: title, author, price
- [ ] Item quantities display correctly

### Empty Cart
- [ ] Empty cart message displays: "Your cart is empty"
- [ ] "Proceed to Payment" button hidden when empty
- [ ] Can still close empty cart

### Cart Items Management
- [ ] Can increase item quantity
- [ ] Can decrease item quantity
- [ ] Remove button appears for each item
- [ ] Clicking remove deletes item
- [ ] Cart updates immediately

### Cart Calculations
- [ ] Subtotal calculated correctly
- [ ] GST (18%) calculated correctly
- [ ] Total = Subtotal + GST (correct math)
- [ ] Prices display with ₹ currency symbol
- [ ] Prices formatted to 2 decimal places

---

## 💳 PAYMENT SECTION TESTS

### Order Summary
- [ ] "Order Summary" section shows when cart has items
- [ ] Displays correct number of items
- [ ] Displays correct total amount
- [ ] Payment status message area ready

### Payment Button
- [ ] "Proceed to Payment" button visible when items in cart
- [ ] Button disabled when no items
- [ ] Button has correct styling
- [ ] Clicking button opens payment process

---

## 📋 RAZORPAY PAYMENT TEST

### Razorpay Modal
- [ ] Razorpay modal opens when payment button clicked
- [ ] Modal displays order details
- [ ] Test key from environment variable loads

### Test Payment (use these credentials)
- [ ] Modal allows entering payment details
- [ ] Can enter card: `4111 1111 1111 1111`
- [ ] Can enter expiry: Any future date
- [ ] Can enter CVV: `123`
- [ ] "Pay" button executes payment

### Payment Success
- [ ] Success message displays: "✓ Payment successful!"
- [ ] Order ID shows in response
- [ ] Cart clears after success
- [ ] Drawer closes after 3 seconds
- [ ] Can add new items and pay again

### Payment Failure/Cancel
- [ ] Can cancel payment in modal
- [ ] Error message displays appropriately
- [ ] Cart items remain in cart
- [ ] Can retry payment

---

## 🔧 TECHNICAL TESTS

### Console (F12)
- [ ] No error messages
- [ ] No warning messages
- [ ] Network tab shows successful API calls
- [ ] API calls to `http://localhost:5000` work

### Backend API Calls
- [ ] `/create-order` endpoint called
- [ ] `/verify-payment` endpoint called
- [ ] Responses contain expected data
- [ ] CORS headers present

### Responsive Design
- [ ] Works on desktop (1920px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)
- [ ] Drawer width adjusts on mobile
- [ ] Text readable on all sizes

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No lag when adding items
- [ ] Smooth drawer animation
- [ ] Smooth search filtering

---

## 🚨 ERROR HANDLING

### Network Issues
- [ ] Graceful error if backend down
- [ ] Error message clear to user
- [ ] Not crash/hang application

### Invalid Inputs
- [ ] Can't pay with empty cart
- [ ] Button disabled appropriately
- [ ] Quantity can't go below 0

### Payment Errors
- [ ] Handles Razorpay timeout
- [ ] Shows error message
- [ ] User can retry

---

## 📱 CROSS-BROWSER TEST (if possible)

Test in multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

Verify:
- [ ] All features work
- [ ] Styling consistent
- [ ] No JavaScript errors

---

## 🌐 ENVIRONMENT VARIABLES

### .env.local
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx
REACT_APP_BACKEND_URL=http://localhost:5000
```
- [ ] File exists
- [ ] Contains correct values
- [ ] App uses correct values

### Production Ready
- [ ] Know production Razorpay key
- [ ] Know production backend URL
- [ ] Credentials safe (not in git)

---

## 📝 PRE-DEPLOYMENT VERIFICATION

Before deploying to Vercel:

```bash
# 1. Production build test
npm run build
```
- [ ] Build completes without errors
- [ ] Build folder created
- [ ] No build warnings

```bash
# 2. Code quality
```
- [ ] No console.error() logs left
- [ ] No console.log() debug statements
- [ ] No commented-out code blocks
- [ ] Code is clean and professional

```bash
# 3. Git repository
```
- [ ] All changes committed
- [ ] No untracked important files
- [ ] Ready to push

```bash
# 4. Documentation
```
- [ ] .env in .gitignore
- [ ] vercel.json in root
- [ ] README.md updated (optional)
- [ ] Comments in tricky code

---

## ✨ FINAL CHECKS

- [ ] All tests above passed ✅
- [ ] No known bugs
- [ ] Stable and ready
- [ ] Deployment can proceed 🚀

---

## 🚀 NEXT STEP

When all checks pass:

→ Follow: **[VERCEL_QUICK_DEPLOY.md](./VERCEL_QUICK_DEPLOY.md)**

**Deploy to Vercel! 🎉**

---

## ❓ FAILED A TEST?

If any test fails before deployment:

1. **Identify the issue**
2. **Fix the code locally**
3. **Re-run the test**
4. **Commit the fix**
5. **Continue checklist**

**Do not deploy with failing tests!**
