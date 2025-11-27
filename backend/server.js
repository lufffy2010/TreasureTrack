import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Debug: Check if environment variables are loading
console.log('🔍 Environment Check:');
console.log('MONGODB_URI present:', !!process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing from environment variables');
  console.log('💡 Check your .env file in backend folder');
}

console.log('🔗 Attempting MongoDB connection...');
console.log('Connection string:', MONGODB_URI ? 'Present' : 'Missing');

// MongoDB connection with better error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🎯 Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection Failed:');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('💡 Check:');
    console.log('1. MongoDB Atlas cluster is active');
    console.log('2. Password is correct');
    console.log('3. IP address is whitelisted (0.0.0.0/0)');
    console.log('4. Database user has correct permissions');
  });

// Better health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const connectionInfo = {
    status: 'OK',
    database: dbStatus,
    connectionState: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
    message: dbStatus === 'Connected' ? 'MongoDB is connected' : 'MongoDB is disconnected'
  };
  res.json(connectionInfo);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('🔧 Debugging Tips:');
  console.log('1. Check .env file exists in backend folder');
  console.log('2. Verify MongoDB Atlas cluster is active');
  console.log('3. Check Network Access in MongoDB Atlas');
});