import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://surajkumar2010th_db_user:b3WW9Nm5Kh52igPc@cluster0.wv4ocse.mongodb.net/learnlightloop?retryWrites=true&w=majority&appName=Cluster0";
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error: ", err);
    process.exit(1);
  }
};

export default connectDB;