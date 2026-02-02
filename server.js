import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import auth from './middleware/auth.js';
import verifyRoutes from './routes/auth.js';
import { sendVerificationEmail } from './utils/emailTemplates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();

const app = express();

// ✅ Dynamic CORS
const allowedOrigins = [
  'http://localhost:5500',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://hibachiapp.onrender.com' 
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Allow credentials manually
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/habits', habitRoutes);
// server.js
const staticPath = path.join(__dirname, 'HibachiApp/frontend');
console.log('Static path:', staticPath);
app.use(express.static(staticPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});


// Optional: test email route
app.get('/test-email', async (req, res) => {
  try {
    await sendVerificationEmail('iordyecalvin@gmail.com', 'test-token-123');
    res.send('✅ Test email sent!');
  } catch (err) {
    console.error(' Failed to send test email:', err);
    res.status(500).send(' Failed to send email');
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Trust proxy for cookies
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
