import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import { startCleanupJob } from './cron/cleanup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Security Enhanced
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173', // Development fallback
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.error('CORS blocked origin:', origin);
      console.error('Allowed origins:', allowedOrigins);
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting - Security Enhancement
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per 15 minutes
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/admin/login', authLimiter);

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SmartXerox API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.message || 'Internal server error'
  });
});

// Start cleanup cron job
startCleanupJob();

app.listen(PORT, () => {
  console.log(`🚀 SmartXerox server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🧹 Cleanup job scheduled to run every hour`);
  }
});
