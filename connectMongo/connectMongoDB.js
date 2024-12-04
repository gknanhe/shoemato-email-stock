import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb Connected");
  } catch (error) {
    console.log("error in connecting to db", error.message);
  }
};

export default connectMongoDB;
