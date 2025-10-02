import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import expenseRoutes from './routes/expenses.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// MongoDB connection - Use environment variable for secure connection
const connection_url = process.env.MONGODB_URI || 'mongodb://localhost:27017/blingledger';

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/expenses', expenseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Blingledger API is running!', 
    env: process.env.VERCEL ? 'vercel' : 'local',
    timestamp: new Date().toISOString()
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Blingledger API is running!' });
});

// Start server locally only. On Vercel, export the handler for serverless runtime.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

// Export serverless handler for Vercel (@vercel/node)
export default function handler(req, res) {
  return app(req, res);
}