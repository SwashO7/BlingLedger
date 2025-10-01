import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Travel', 'Groceries', 'Rent', 'Other']
  },
  subCategory: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to ensure proper data structure
expenseSchema.pre('save', function(next) {
  if (this.category !== 'Food') {
    this.subCategory = undefined;
  }
  if (this.category === 'Food') {
    this.description = undefined;
  }
  next();
});

export default mongoose.model('Expense', expenseSchema);