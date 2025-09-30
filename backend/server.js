const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// MongoDB connection - FIXED: Use lowercase database name to avoid conflict
mongoose.connect('mongodb://localhost:27017/blingledger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB (blingledger database)'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/expenses', require('./routes/expenses'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Blingledger API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});