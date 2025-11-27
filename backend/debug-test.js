// debug-test.js
import mongoose from 'mongoose';

// Test different connection strings
const testConnections = [
  {
    name: "With appName",
    uri: "mongodb+srv://surajkumar2010th_db_user:rSHsi50uB3dd3iRe!@treasure.h3aih97.mongodb.net/treasuretrack?retryWrites=true&w=majority&appName=treasure"
  },
  {
    name: "Without appName", 
    uri: "mongodb+srv://surajkumar2010th_db_user:rSHsi50uB3dd3iRe!@treasure.h3aih97.mongodb.net/treasuretrack?retryWrites=true&w=majority"
  },
  {
    name: "Different database",
    uri: "mongodb+srv://surajkumar2010th_db_user:rSHsi50uB3dd3iRe!@treasure.h3aih97.mongodb.net/test?retryWrites=true&w=majority"
  }
];

async function testConnection() {
  for (const connection of testConnections) {
    console.log(`\n🔗 Testing: ${connection.name}`);
    console.log(`URI: ${connection.uri.replace(/:[^:]*@/, ':••••@')}`);
    
    try {
      await mongoose.connect(connection.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ SUCCESS: Connected!');
      await mongoose.disconnect();
    } catch (error) {
      console.log('❌ FAILED:', error.message);
    }
  }
}

testConnection();