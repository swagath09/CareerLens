require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { initializeFirebase } = require('./config/firebase');
const userRoutes = require('./routes/users');
const resumeRoutes = require('./routes/resumes');
const analysisRoutes = require('./routes/analyses');
const aiRoutes = require('./routes/ai');          // ← MOVED UP here
const errorHandler = require('./middleware/errorHandler');

initializeFirebase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan('dev'));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CareerLens API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/ai', aiRoutes);                     // ← MOVED UP here

// ── 404 Handler (must be LAST) ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.path} not found` });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 CareerLens Backend running on http://localhost:${PORT}`);
  console.log(`📋 API docs: http://localhost:${PORT}/health\n`);
});

module.exports = app;