import mongoose from 'mongoose';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Manually read .env file
const envPath = join(__dirname, '.env');
console.log('📁 Looking for .env at:', envPath);

let MONGODB_URI;
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 .env file content found');
  
  // Parse MONGODB_URI from .env content
  const match = envContent.match(/MONGODB_URI=(.+)/);
  if (match) {
    MONGODB_URI = match[1].trim();
    console.log('✅ MONGODB_URI extracted from .env');
  } else {
    console.log('❌ MONGODB_URI not found in .env content');
  }
} catch (err) {
  console.error('❌ Error reading .env file:', err.message);
}

console.log('🔗 Testing connection to Atlas...');
console.log('Connection string:', MONGODB_URI ? 'Found ✅' : 'NOT FOUND ❌');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

// Hide password in logs
const safeUri = MONGODB_URI.replace(/:([^@:]+)@/, ':****@');
console.log('🔗 Connecting to:', safeUri);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database name:', mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections found:', collections.length > 0 ? collections.map(c => c.name) : 'None');
    
    // Check if expenses collection exists and count documents
    try {
      const expensesCount = await mongoose.connection.db.collection('expenses').countDocuments();
      console.log('💰 Expenses in database:', expensesCount);
      
      if (expensesCount > 0) {
        const sample = await mongoose.connection.db.collection('expenses').findOne();
        console.log('📄 Sample expense:', JSON.stringify(sample, null, 2));
      } else {
        console.log('📄 No expenses found - database is empty');
        console.log('💡 This is normal for a new setup. Data will appear here after adding expenses.');
      }
    } catch (err) {
      console.log('📄 No expenses collection found yet');
    }
    
    console.log('🎉 Atlas connection test successful!');
    console.log('💡 Your app should be able to connect to Atlas in production!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Atlas connection failed:');
    console.error('Error details:', err.message);
    
    if (err.message.includes('authentication failed')) {
      console.error('🔑 Authentication issue - check username/password');
      console.error('💡 Verify credentials in MongoDB Atlas dashboard');
    }
    if (err.message.includes('network') || err.message.includes('ENOTFOUND')) {
      console.error('🌐 Network issue - check internet connection');
      console.error('💡 Also check MongoDB Atlas network access settings');
    }
    if (err.message.includes('timeout')) {
      console.error('⏰ Connection timeout - check Atlas cluster status');
    }
    
    process.exit(1);
  });