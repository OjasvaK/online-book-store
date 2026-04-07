#!/bin/bash
# Deployment Helper Script for Vercel
# Quick verification that everything is ready

echo "🔍 Checking Vercel Deployment Readiness..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Run: npm install"
else
    echo "✅ node_modules found"
fi

# Check if vercel.json exists
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
else
    echo "❌ vercel.json missing - create it from template"
fi

# Check if .gitignore has .env
if grep -q "\.env" .gitignore; then
    echo "✅ .env is in .gitignore (secure)"
else
    echo "⚠️  .env not in .gitignore - add it!"
fi

# Check package.json scripts
echo ""
echo "📦 Build Scripts:"
grep '"build"' package.json | head -1

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 DEPLOYMENT CHECKLIST:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pre-Deployment:"
echo "  [ ] Code committed to GitHub"
echo "  [ ] Backend deployed and responding"
echo "  [ ] vercel.json in root directory"
echo ""
echo "During Deployment (Vercel UI):"
echo "  [ ] Project imported from GitHub"
echo "  [ ] Environment variables set:"
echo "      - REACT_APP_RAZORPAY_KEY_ID"
echo "      - REACT_APP_BACKEND_URL"
echo "  [ ] Deploy clicked"
echo ""
echo "Post-Deployment:"
echo "  [ ] Site loads without errors"
echo "  [ ] Cart opens and closes"
echo "  [ ] API calls work (checkout, verify)"
echo "  [ ] No console errors"
echo ""
echo "✨ Ready to deploy! Follow VERCEL_QUICK_DEPLOY.md"
