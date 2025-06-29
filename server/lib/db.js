import mongoose from "mongoose";

// function to connect to the database
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    await mongoose.connect(`${process.env.MONGO_URI}/chat-app`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};
