const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Travel', 'Groceries', 'Rent', 'Other']
  },
  subCategory: {
    type: String,
    required: false,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks', '']
  },
  description: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);