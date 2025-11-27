// network-test.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://surajkumar2010th_db_user:rSHsi50uB3dd3iRe!@treasure.h3aih97.mongodb.net/treasuretrack?retryWrites=true&w=majority";

async function testConnection() {
  console.log('🔗 Testing network connection to MongoDB Atlas...');
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    socketTimeoutMS: 5000
  });

  try {
    await client.connect();
    console.log('✅ Network connection successful!');
    await client.db().admin().ping();
    console.log('✅ Database ping successful!');
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('');
    console.log('🔧 Likely issues:');
    console.log('1. Internet connection problem');
    console.log('2. Firewall blocking connection');
    console.log('3. MongoDB Atlas cluster down');
    console.log('4. IP address not whitelisted');
  } finally {
    await client.close();
  }
}

testConnection();