import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
  const dbUrl = process.env.DB_URL;
  console.log("Connecting to MongoDB...", dbUrl);
  const conn = await mongoose.connect(dbUrl as string);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
};
export default connectDB;
