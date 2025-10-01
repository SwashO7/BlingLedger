import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// GET /api/expenses - Get all expenses (sorted by most recent first)
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

// POST /api/expenses - Create a new expense
router.post('/', async (req, res) => {
  try {
    console.log('📥 Received expense data:', JSON.stringify(req.body, null, 2));
    
    const { category, subCategory, description, amount, date } = req.body;

    // Enhanced validation
    if (!category || !amount) {
      console.log('❌ Validation error: Missing required fields');
      return res.status(400).json({ message: 'Category and amount are required' });
    }
    
    if (parseFloat(amount) < 0.01) {
      return res.status(400).json({ message: 'Amount must be at least 0.01' });
    }

    // Create new expense
    const expense = new Expense({
      category,
      subCategory: category === 'Food' ? subCategory : undefined,
      description: category !== 'Food' ? description : undefined,
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date()
    });

    console.log('💾 Creating expense:', expense.toObject());
    const savedExpense = await expense.save();
    console.log('✅ Expense saved successfully with ID:', savedExpense._id);
    
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('❌ Error creating expense:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating expense',
      error: error.message 
    });
  }
});

// DELETE /api/expenses/clear-all - Delete all expenses
router.delete('/clear-all', async (req, res) => {
  try {
    const result = await Expense.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} expenses`);
    res.json({ 
      message: 'All expenses cleared successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('❌ Error clearing expenses:', error);
    res.status(500).json({ 
      message: 'Server error while clearing expenses',
      error: error.message 
    });
  }
});

export default router;