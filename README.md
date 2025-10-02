# BlingLedger - Personal Expense Tracking App

A modern, full-stack MERN application for tracking personal expenses with analytics and AI chatbot features.

## Features

- **Expense Logging**: Quick and easy expense entry with category-based conditional forms
- **Analytics Dashboard**: Visual insights with pie charts, bar charts, and recent transactions
- **AI Chatbot**: Conversational interface for querying expense data
- **Modern UI**: Clean, responsive design using Tailwind CSS
- **Real-time Data**: Instant updates and seamless single-page experience

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - Chart library
- **Lucide React** - Icon library

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (running locally on port 27017)

## Installation & Setup

### 1. Clone/Download the project
```bash
# Navigate to your desired directory
cd path/to/your/directory
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system. The application expects MongoDB to be available at `mongodb://localhost:27017/Blingledger`.

**Windows:**
```bash
# If MongoDB is installed as a service
net start MongoDB

# Or run mongod directly
mongod
```

**macOS/Linux:**
```bash
# If installed via Homebrew (macOS)
brew services start mongodb-community

# Or run mongod directly
sudo mongod
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The backend server will start on `http://localhost:5000`

**Alternative:** For development with auto-restart:
```bash
npm run dev
```

### 2. Start the Frontend Application
Open a new terminal window/tab:
```bash
cd frontend
npm start
```
The frontend application will start on `http://localhost:3000` and automatically open in your browser.

## Usage Guide

### Adding Expenses (Ledger Page)
1. Select a category from the dropdown (Food, Travel, Groceries, Rent, Other)
2. **For Food category**: Choose a subcategory (Breakfast, Lunch, Dinner, Snacks, Drinks)
3. **For other categories**: Enter a brief description
4. Enter the expense amount
5. Select or keep the default date
6. Click "Add Expense"

### Viewing Analytics (Dashboard Page)
- **Total Net Expenditure**: Overview of total spending
- **Category Pie Chart**: Visual breakdown of spending by category
- **Monthly Bar Chart**: Spending trends over time
- **Recent Transactions**: Last 10 expense entries

### Using the Chatbot
1. Click the chat icon in the bottom-right corner
2. Ask questions about your spending:
   - "total" - Shows total expenditure
   - "total food" - Shows total spent on food
   - "total lunch" - Shows total spent on lunch
   - "total rent" - Shows total spent on rent
   - And more category/subcategory combinations

## API Endpoints

### Backend API
- `GET /api/expenses` - Retrieve all expenses (sorted by date, newest first)
- `POST /api/expenses` - Create a new expense

### Example API Usage
```javascript
// Get all expenses
const response = await axios.get('http://localhost:5000/api/expenses');

// Add new expense
const expense = {
  category: 'Food',
  subCategory: 'Lunch',
  amount: 15.99,
  date: '2023-12-01'
};
await axios.post('http://localhost:5000/api/expenses', expense);
```

## File Structure

```
BlingLedger/
├── backend/
│   ├── models/
│   │   └── Expense.js          # Mongoose schema
│   ├── routes/
│   │   └── expenses.js         # API routes
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express server
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML template with Tailwind CDN
│   ├── src/
│   │   ├── App.jsx             # Main React component (all-in-one)
│   │   └── index.js            # React entry point
│   └── package.json            # Frontend dependencies
└── README.md                   # This file
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on port 27017
   - Check if you have proper permissions to create databases

2. **Port Already in Use**
   - Backend (5000): Kill any process using port 5000 or change the PORT in server.js
   - Frontend (3000): Kill any process using port 3000 or let React start on a different port

3. **CORS Issues**
   - Ensure the backend server is running before starting the frontend
   - Check that CORS is properly configured in server.js

4. **Charts Not Displaying**
   - Ensure you have expense data in your database
   - Check browser console for any JavaScript errors

### Development Tips

- Use `npm run dev` in the backend for auto-restart during development
- The frontend has hot-reload enabled by default
- MongoDB data persists between sessions
- Use browser DevTools to inspect API calls and debug issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Ensure all prerequisites are met
3. Verify that both servers are running
4. Check browser console and terminal for error messages

---

**Happy expense tracking with BlingLedger! 💰📊**

<!-- Deployed to Vercel with cloud MongoDB -->