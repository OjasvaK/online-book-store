// ============================================================================
// BACKEND SERVER - COMPLETE PRODUCTION CODE
// File: backend/server.js
// ============================================================================

// Import required packages
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// ==================== CORS CONFIGURATION ====================
// CORS Configuration for production and development
const allowedOrigins = [
  'http://localhost:3000',           // Local development
  'http://localhost:3001',           // Local development (alternative port)
  'https://online-book-store-pied.vercel.app', // Production frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ENVIRONMENT VALIDATION ====================
// Validate required environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('ERROR: Razorpay credentials are not configured!');
  console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file or environment variables');
  process.exit(1);
}

// Initialize Razorpay instance with API credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('✓ Razorpay initialized successfully');
console.log(`✓ Environment: ${process.env.NODE_ENV || 'production'}`);

// ==================== API ENDPOINTS ====================

/**
 * POST /create-order
 * Creates a new order in Razorpay
 * 
 * Request body:
 * {
 *   "amount": 50000,          // Amount in paise (50000 paise = ₹500)
 *   "currency": "INR",        // Currency code
 *   "receipt": "receipt_123"  // Optional: receipt ID
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "order": { order details from Razorpay }
 * }
 */
app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required (must be greater than 0)',
      });
    }

    // Create order options
    const options = {
      amount: amount, // Amount in paise (multiply by 100 if you have amount in rupees)
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    // Call Razorpay API to create order
    const order = await razorpay.orders.create(options);

    // Return successful response with order details
    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

/**
 * POST /verify-payment
 * Verifies the payment signature from Razorpay
 * 
 * Request body:
 * {
 *   "razorpay_order_id": "order_123",
 *   "razorpay_payment_id": "pay_123",
 *   "razorpay_signature": "signature_hash"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Payment verified successfully"
 * }
 */
app.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data',
      });
    }

    // Create signature to verify payment
    // Signature is created by combining order_id and payment_id with secret key
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Compare signatures
    if (expectedSignature === razorpay_signature) {
      // Payment is verified successfully
      // You can save payment details to your database here

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentDetails: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
      });
    } else {
      // Signature doesn't match - payment is fraudulent
      res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message,
    });
  }
});

/**
 * GET /
 * Health check endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Online Book Store Backend - Payment Integration API',
    version: '1.0.0',
    endpoints: {
      createOrder: 'POST /create-order',
      verifyPayment: 'POST /verify-payment',
    },
  });
});

// ==================== ERROR HANDLING ====================

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==================== SERVER STARTUP ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     Online Book Store Backend - Razorpay Integration       ║
║     Server running on http://localhost:${PORT}                    ║
╚════════════════════════════════════════════════════════════╝
  `);
  console.log('Available Endpoints:');
  console.log(`  • POST   http://localhost:${PORT}/create-order`);
  console.log(`  • POST   http://localhost:${PORT}/verify-payment`);
});

// ============================================================================
// BACKEND PACKAGE.JSON - REFERENCE
// ============================================================================

/*
{
  "name": "online-book-store-backend",
  "version": "1.0.0",
  "description": "Backend for Online Book Store with Razorpay payment integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "razorpay",
    "payment",
    "express",
    "nodejs"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "razorpay": "^2.9.2",
    "crypto": "^1.0.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
*/

// ============================================================================
// BACKEND .ENV - REFERENCE (Keep this in .gitignore - Never commit!)
// ============================================================================

/*
RAZORPAY_KEY_ID=rzp_live_SUahG6dlANgZ71
RAZORPAY_KEY_SECRET=93vJIjIKwJwivwewAWlymCHj
NODE_ENV=production
PORT=5000
*/
