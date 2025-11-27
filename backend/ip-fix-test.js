// ip-fix-test.js
import mongoose from 'mongoose';

console.log('🔗 Testing connection after IP whitelist fix...');

// Wait for IP whitelist to be applied
setTimeout(async () => {
  const MONGODB_URI = "mongodb+srv://surajkumar2010th_db_user:cqvSitf3IoLTK6VW@treasure.h3aih97.mongodb.net/treasuretrack?retryWrites=true&w=majority";
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ SUCCESS: Connected to MongoDB!');
    console.log('🎉 IP whitelist fix worked!');
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    console.log('');
    console.log('💡 Make sure:');
    console.log('1. IP address 0.0.0.0/0 is added to Network Access');
    console.log('2. Wait 2 minutes after adding IP');
    console.log('3. Check password is correct');
  }
  
  process.exit(0);
}, 120000); // Wait 2 minutes for IP whitelist to apply