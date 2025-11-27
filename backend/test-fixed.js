// test-new.js
import mongoose from 'mongoose';

// Replace NEW_PASSWORD with the actual new password
const MONGODB_URI = "mongodb+srv://treasureuser:surajkumar2010th_db_user:cqvSitf3IoLTK6VW@treasure.h3aih97.mongodb.net/treasuretrack?retryWrites=true&w=majority";

console.log('🔗 Testing with new credentials...');

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ SUCCESS: MongoDB Connected!');
  console.log('🎉 Database connection established');
  process.exit(0);
})
.catch((error) => {
  console.log('❌ FAILED:', error.message);
  console.log('');
  console.log('💡 Solutions:');
  console.log('1. Reset password in MongoDB Atlas');
  console.log('2. Create new database user');
  console.log('3. Check Network Access has 0.0.0.0/0');
  process.exit(1);
});