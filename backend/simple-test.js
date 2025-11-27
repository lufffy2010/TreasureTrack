// simple-test.js
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://surajkumar2010th_db_user:rSHsi50uB3dd3iRe!@treasure.h3aih97.mongodb.net/treasuretrack?retryWrites=true&w=majority";

console.log('🔗 Testing connection...');

// Set timeout to prevent hanging
setTimeout(() => {
  console.log('⏰ Connection timeout - server not responding');
  process.exit(1);
}, 10000);

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ SUCCESS: MongoDB Connected!');
  process.exit(0);
})
.catch((error) => {
  console.log('❌ FAILED:', error.message);
  process.exit(1);
});