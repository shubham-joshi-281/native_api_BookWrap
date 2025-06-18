import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(`Error in connnecting Database ${error?.message}`);
    process.exit(1);
  }
};

export default connectDB;
