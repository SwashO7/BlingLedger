import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageCircle, X, Plus, PieChart as PieChartIcon, Home, Send, Calendar } from 'lucide-react';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api';

function App() {
  const [page, setPage] = useState('ledger');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Enhanced formatCurrency for Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Dark Mode Gold Bling Theme CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      
      body {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        color: #e5e5e5;
      }
      
      @keyframes rotate3D {
        0% { transform: rotateY(0deg) rotateX(0deg); }
        25% { transform: rotateY(90deg) rotateX(15deg); }
        50% { transform: rotateY(180deg) rotateX(0deg); }
        75% { transform: rotateY(270deg) rotateX(-15deg); }
        100% { transform: rotateY(360deg) rotateX(0deg); }
      }
      
      @keyframes goldGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
        50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.2); }
      }
      
      .rotating-rupee {
        animation: rotate3D 4s linear infinite;
        transform-style: preserve-3d;
        display: inline-block;
        font-weight: bold;
        color: #FFD700;
        text-shadow: 2px 2px 4px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.2);
        filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));
      }
      
      .blingledger-logo {
        filter: drop-shadow(0 2px 8px rgba(255, 215, 0, 0.3));
        transition: filter 0.3s ease;
      }
      
      .blingledger-logo:hover {
        filter: drop-shadow(0 4px 12px rgba(255, 215, 0, 0.5));
      }
      
      .gold-button {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        border: 2px solid #FFD700;
        transition: all 0.3s ease;
      }
      
      .gold-button:hover {
        background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
        transform: translateY(-1px);
      }
      
      .dark-card {
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border: 1px solid #333;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      
      .dark-input {
        background: #2a2a2a;
        border: 2px solid #404040;
        color: #e5e5e5;
        transition: all 0.3s ease;
      }
      
      .dark-input:focus {
        border-color: #FFD700;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
      }
      
      .gold-accent {
        color: #FFD700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      }
      
      .bling-glow {
        animation: goldGlow 2s ease-in-out infinite;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      
      @media (max-width: 640px) {
        .rotating-rupee { font-size: 1.5rem; }
        .xs\\:inline { display: inline; }
      }
      
      @media (min-width: 480px) {
        .xs\\:inline { display: inline; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setMessage('Error fetching expenses');
    } finally {
      setLoading(false);
    }
  };

  const LedgerPage = () => {
    const [formData, setFormData] = useState({
      category: '',
      subCategory: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });

    const categories = ['Food', 'Travel', 'Groceries', 'Rent', 'Other'];
    const foodSubCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.category || !formData.amount) {
        setMessage('Please fill in all required fields');
        return;
      }

      try {
        setLoading(true);
        const expenseData = {
          category: formData.category,
          amount: parseFloat(formData.amount),
          date: formData.date
        };

        if (formData.category === 'Food') {
          expenseData.subCategory = formData.subCategory;
        } else {
          expenseData.description = formData.description;
        }

        const response = await axios.post(`${API_BASE_URL}/expenses`, expenseData, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        });
        
        if (response.status >= 200 && response.status < 300) {
          setMessage(' Expense added successfully!');
          setFormData({
            category: '',
            subCategory: '',
            description: '',
            amount: '',
            date: new Date().toISOString().split('T')[0]
          });
          fetchExpenses();
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error) {
        console.error(' Error adding expense:', error);
        let errorMessage = 'Error adding expense. ';
        if (error.response?.data) {
          errorMessage += error.response.data.message || error.response.data.error || 'Server error occurred.';
        } else if (error.request) {
          errorMessage += 'Cannot connect to server. Please ensure backend is running on port 5001.';
        } else {
          errorMessage += error.message;
        }
        setMessage(errorMessage);
        setTimeout(() => setMessage(''), 5000);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="w-full max-w-none px-4 py-4 sm:max-w-2xl sm:mx-auto sm:p-6 lg:max-w-4xl">
        <div className="dark-card rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-yellow-500/20">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gold-accent mb-4 sm:mb-6 md:mb-8 text-center">Add New Expense</h2>
          
          {message && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl text-center border-2 text-sm sm:text-base ${
              message.includes('success') 
                ? 'bg-green-900/30 text-green-300 border-green-500/50' 
                : 'bg-red-900/30 text-red-300 border-red-500/50'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category <span className="text-yellow-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: '', description: ''})}
                className="dark-input w-full p-3 sm:p-3 rounded-xl text-base"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {formData.category === 'Food' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Food Type <span className="text-yellow-400">*</span>
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                  className="dark-input w-full p-3 sm:p-3 rounded-xl text-base"
                  required
                >
                  <option value="">Select food type</option>
                  {foodSubCategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.category && formData.category !== 'Food' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the expense"
                  className="dark-input w-full p-3 sm:p-3 rounded-xl text-base"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (₹) <span className="text-yellow-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-yellow-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    className="dark-input w-full pl-10 pr-3 py-3 rounded-xl text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date <span className="text-yellow-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-yellow-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="dark-input w-full pl-10 pr-3 py-3 rounded-xl text-base"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-button w-full text-black font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-300 text-base sm:text-lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Add Expense</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const StatsPage = () => {
    const totalExpenditure = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryData = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const pieData = Object.entries(categoryData).map(([category, amount]) => ({
      name: category,
      value: amount
    }));

    const monthlyData = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
      return acc;
    }, {});

    const barData = Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    const recentTransactions = expenses.slice(0, 10);
    const COLORS = [
      '#FFD700', // Gold
      '#FFA500', // Orange
      '#FF8C00', // Dark Orange
      '#32CD32', // Lime Green
      '#00CED1', // Dark Turquoise
      '#FF6347', // Tomato Red
      '#9370DB', // Medium Purple
      '#20B2AA', // Light Sea Green
      '#FF69B4', // Hot Pink
      '#87CEEB', // Sky Blue
      '#DDA0DD', // Plum
      '#98FB98', // Pale Green
      '#F0E68C', // Khaki
      '#FFB6C1', // Light Pink
      '#ADD8E6', // Light Blue
      '#FFA07A', // Light Salmon
      '#90EE90', // Light Green
      '#FFE4B5', // Moccasin
      '#D3D3D3', // Light Gray
      '#F5DEB3'  // Wheat
    ];

    return (
      <div className="w-full max-w-none px-4 py-4 sm:max-w-7xl sm:mx-auto sm:p-6 space-y-4 sm:space-y-6 lg:space-y-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gold-accent text-center mb-4 sm:mb-6 lg:mb-8">Expense Analytics</h2>
        
        <div className="dark-card rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 text-center border-2 border-yellow-500/30 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200">Total Net Expenditure</h3>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold gold-accent">{formatCurrency(totalExpenditure)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="dark-card rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-yellow-500/20">
            <h3 className="text-lg sm:text-xl font-bold gold-accent mb-3 sm:mb-4 text-center">Expenses by Category</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    className="sm:!r-20"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Amount']} 
                    contentStyle={{backgroundColor: '#2a2a2a', border: '1px solid #FFD700', borderRadius: '8px', color: '#e5e5e5', fontSize: '14px'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm sm:text-base">No data available</div>
            )}
          </div>

          <div className="dark-card rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-yellow-500/20">
            <h3 className="text-lg sm:text-xl font-bold gold-accent mb-3 sm:mb-4 text-center">Monthly Expenses</h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="month" tick={{fill: '#e5e5e5', fontSize: 12}} />
                  <YAxis tick={{fill: '#e5e5e5', fontSize: 12}} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Amount']} 
                    contentStyle={{backgroundColor: '#2a2a2a', border: '1px solid #FFD700', borderRadius: '8px', color: '#e5e5e5', fontSize: '14px'}}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm sm:text-base">No data available</div>
            )}
          </div>
        </div>

        <div className="dark-card rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-yellow-500/20">
          <h3 className="text-lg sm:text-xl font-bold gold-accent mb-3 sm:mb-4">Recent Transactions</h3>
          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Date</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Category</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider hidden sm:table-cell">Description</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {recentTransactions.map((expense, index) => (
                    <tr key={expense._id || index} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                        {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <div className="sm:hidden text-xs text-gray-400 mt-1">
                          {expense.subCategory || expense.description || '-'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-300 hidden sm:table-cell">
                        {expense.subCategory || expense.description || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium gold-accent">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions yet. Start by adding some expenses!
            </div>
          )}
        </div>
      </div>
    );
  };

  const Chatbot = () => {
    const chatContainerRef = React.useRef(null);
    const inputRef = React.useRef(null);

    // Enhanced date filtering functions
    const getDateRange = (period) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (period) {
        case 'today':
          return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
        case 'yesterday':
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          return { start: yesterday, end: today };
        case 'this week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return { start: weekStart, end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) };
        case 'last week':
          const lastWeekEnd = new Date(today);
          lastWeekEnd.setDate(today.getDate() - today.getDay());
          const lastWeekStart = new Date(lastWeekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
          return { start: lastWeekStart, end: lastWeekEnd };
        case 'this month':
          return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 1) };
        case 'last month':
          return { start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: new Date(now.getFullYear(), now.getMonth(), 1) };
        case 'this year':
          return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear() + 1, 0, 1) };
        case 'last year':
          return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear(), 0, 1) };
        default:
          return null;
      }
    };

    const filterExpensesByDate = (expenses, period) => {
      const range = getDateRange(period);
      if (!range) return expenses;
      
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= range.start && expenseDate < range.end;
      });
    };

    const processMessage = async (message) => {
      const lowerMessage = message.toLowerCase();
      const categories = ['food', 'travel', 'groceries', 'rent', 'other'];
      const foodSubCategories = ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks'];
      const timePeriods = ['today', 'yesterday', 'this week', 'last week', 'this month', 'last month', 'this year', 'last year'];
      
      // Check for time period
      let filteredExpenses = expenses;
      let timePeriod = '';
      for (const period of timePeriods) {
        if (lowerMessage.includes(period)) {
          filteredExpenses = filterExpensesByDate(expenses, period);
          timePeriod = period;
          break;
        }
      }

      // Handle highest/lowest expense queries
      if (lowerMessage.includes('highest') || lowerMessage.includes('lowest')) {
        if (filteredExpenses.length === 0) {
          return `No expenses found${timePeriod ? ` for ${timePeriod}` : ''}.`;
        }

        const isHighest = lowerMessage.includes('highest');
        let categoryFilter = '';
        
        // Check for category in the query
        for (const cat of categories) {
          if (lowerMessage.includes(cat)) {
            filteredExpenses = filteredExpenses.filter(expense => expense.category.toLowerCase() === cat);
            categoryFilter = cat;
            break;
          }
        }

        if (filteredExpenses.length === 0) {
          return `No ${categoryFilter} expenses found${timePeriod ? ` for ${timePeriod}` : ''}.`;
        }

        const sortedExpenses = filteredExpenses.sort((a, b) => isHighest ? b.amount - a.amount : a.amount - b.amount);
        const targetExpense = sortedExpenses[0];
        const description = targetExpense.subCategory || targetExpense.description || targetExpense.category;
        
        return `${isHighest ? 'Highest' : 'Lowest'} ${categoryFilter || 'expense'}${timePeriod ? ` ${timePeriod}` : ''}: ${formatCurrency(targetExpense.amount)} for ${description} on ${new Date(targetExpense.date).toLocaleDateString()}.`;
      }

      // Handle average spending queries
      if (lowerMessage.includes('average')) {
        if (filteredExpenses.length === 0) {
          return `No expenses found${timePeriod ? ` for ${timePeriod}` : ''} to calculate average.`;
        }

        let categoryFilter = '';
        let avgExpenses = filteredExpenses;

        // Check for category in the query
        for (const cat of categories) {
          if (lowerMessage.includes(cat)) {
            avgExpenses = filteredExpenses.filter(expense => expense.category.toLowerCase() === cat);
            categoryFilter = cat;
            break;
          }
        }

        if (avgExpenses.length === 0) {
          return `No ${categoryFilter} expenses found${timePeriod ? ` for ${timePeriod}` : ''}.`;
        }

        const total = avgExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        if (lowerMessage.includes('daily')) {
          const days = timePeriod ? Math.max(1, Math.ceil((getDateRange(timePeriod).end - getDateRange(timePeriod).start) / (24 * 60 * 60 * 1000))) : 30;
          const dailyAvg = total / days;
          return `Average daily ${categoryFilter || 'spending'}${timePeriod ? ` ${timePeriod}` : ''}: ${formatCurrency(dailyAvg)}`;
        } else if (lowerMessage.includes('monthly')) {
          const months = timePeriod && timePeriod.includes('year') ? 12 : 1;
          const monthlyAvg = total / months;
          return `Average monthly ${categoryFilter || 'spending'}${timePeriod ? ` ${timePeriod}` : ''}: ${formatCurrency(monthlyAvg)}`;
        } else {
          const average = total / avgExpenses.length;
          return `Average ${categoryFilter || 'expense'} amount${timePeriod ? ` ${timePeriod}` : ''}: ${formatCurrency(average)} (${avgExpenses.length} transactions)`;
        }
      }

      // Handle total queries (enhanced with time periods)
      if (lowerMessage.includes('total')) {
        let response = '';
        let found = false;

        // Check subcategories first
        for (const subCat of foodSubCategories) {
          if (lowerMessage.includes(subCat)) {
            const total = filteredExpenses
              .filter(expense => expense.subCategory && expense.subCategory.toLowerCase() === subCat)
              .reduce((sum, expense) => sum + expense.amount, 0);
            response = `Total spent on ${subCat}${timePeriod ? ` ${timePeriod}` : ''}: ${formatCurrency(total)}`;
            found = true;
            break;
          }
        }

        // Check categories
        if (!found) {
          for (const cat of categories) {
            if (lowerMessage.includes(cat)) {
              const total = filteredExpenses
                .filter(expense => expense.category.toLowerCase() === cat)
                .reduce((sum, expense) => sum + expense.amount, 0);
              response = `Total spent on ${cat}${timePeriod ? ` ${timePeriod}` : ''}: ${formatCurrency(total)}`;
              found = true;
              break;
            }
          }
        }

        // Overall total
        if (!found) {
          const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          response = `Total net expenditure${timePeriod ? ` ${timePeriod}` : ''}: ${formatCurrency(total)}`;
        }

        return response;
      }

      return `I can help you with expenses! Try asking:
      
📊 **Totals**: "total food this month", "total rent today"
📈 **Highest/Lowest**: "highest expense last week", "lowest food expense"
📉 **Averages**: "average daily spending", "average food expense this month"
⏰ **Time periods**: today, yesterday, this week, last week, this month, last month, this year, last year
🏷️ **Categories**: food, travel, groceries, rent, other
🍽️ **Food types**: breakfast, lunch, dinner, snacks, drinks`;
    };

    const handleSendMessage = React.useCallback(async () => {
      if (!chatInput.trim()) return;

      const userMessage = { text: chatInput, sender: 'user' };
      setChatMessages(prev => [...prev, userMessage]);
      
      const inputValue = chatInput;
      setChatInput('');
      setIsTyping(true);

      // Keep focus on input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      // Simulate processing delay for better UX
      setTimeout(async () => {
        const botResponse = { text: await processMessage(inputValue), sender: 'bot' };
        setChatMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        
        // Restore focus after bot responds
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }, 800);
    }, [chatInput]);

    const handleKeyPress = React.useCallback((e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    }, [handleSendMessage]);

    const handleInputChange = React.useCallback((e) => {
      setChatInput(e.target.value);
    }, []);

    // Auto-scroll to bottom when messages change
    React.useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, []);

    // Focus input when chat opens and maintain focus
    React.useEffect(() => {
      if (isChatOpen && inputRef.current) {
        const focusInput = () => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        };
        
        // Focus immediately and after a small delay to ensure it works
        focusInput();
        const timeoutId = setTimeout(focusInput, 100);
        
        return () => clearTimeout(timeoutId);
      }
    }, []);

    // Prevent input from losing focus due to re-renders
    React.useEffect(() => {
      if (isChatOpen && inputRef.current && document.activeElement !== inputRef.current && !isTyping) {
        inputRef.current.focus();
      }
    });

    return (
      <>
        <button
          onClick={() => setIsChatOpen(true)}
          className="gold-button fixed bottom-4 right-4 sm:bottom-6 sm:right-6 text-black p-3 sm:p-4 rounded-full shadow-2xl transition-all z-50 bling-glow"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {isChatOpen && (
          <div className="fixed inset-x-4 bottom-16 sm:bottom-20 sm:right-6 sm:left-auto w-auto sm:w-80 lg:w-96 dark-card rounded-xl sm:rounded-2xl shadow-2xl border-2 border-yellow-500/30 z-50">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-3 sm:p-4 rounded-t-xl sm:rounded-t-2xl flex justify-between items-center">
              <h3 className="font-bold text-sm sm:text-base">Expense Assistant</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-black/20 p-1 sm:p-1 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div 
              ref={chatContainerRef}
              className="h-56 sm:h-64 lg:h-72 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-900/20 scroll-smooth"
            >
              {chatMessages.length === 0 && (
                <div className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  <div className="gold-accent font-semibold mb-1 sm:mb-2 text-sm sm:text-base">💬 Welcome to your Expense Assistant!</div>
                  <div className="text-xs">I can help you analyze your spending with queries like:</div>
                  <div className="text-xs mt-1 space-y-1">
                    • "total food this month"<br/>
                    • "highest expense last week"<br/>
                    • "average daily spending"<br/>
                    • "lowest rent expense this year"
                  </div>
                </div>
              )}
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-medium'
                        : 'bg-gray-700 text-gray-200 border border-gray-600 whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-200 border border-gray-600 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center space-x-2">
                    <span>✨ Analyzing your expenses</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-gray-600 flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your expenses..."
                className="dark-input flex-1 p-2 sm:p-3 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500"
                disabled={isTyping}
                autoComplete="off"
                autoFocus
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !chatInput.trim()}
                className="gold-button text-black p-2 sm:p-3 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'}}>
      <nav className="dark-card shadow-xl border-b-2 border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-18">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <img 
                src="/logo/blingledger-logo.png.png" 
                alt="Blingledger Logo" 
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto blingledger-logo"
                onError={(e) => {console.log('Logo failed to load'); e.target.style.display = 'none'}}
              />
              <span className="rotating-rupee text-2xl sm:text-3xl md:text-4xl">₹</span>
            </div>
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4">
              <button
                onClick={() => setPage('ledger')}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 ${
                  page === 'ledger' 
                    ? 'gold-button text-black shadow-lg bling-glow' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 border border-gray-600'
                }`}
              >
                <Home size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Ledger</span>
              </button>
              <button
                onClick={() => setPage('stats')}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 ${
                  page === 'stats' 
                    ? 'gold-button text-black shadow-lg bling-glow' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 border border-gray-600'
                }`}
              >
                <PieChartIcon size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </nav>      <main className="py-8">
        {page === 'ledger' && <LedgerPage />}
        {page === 'stats' && <StatsPage />}
      </main>

      <Chatbot />
    </div>
  );
}

export default App;
