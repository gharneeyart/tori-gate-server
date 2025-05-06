import mongoose from "mongoose";

// Connect to MongoDB
export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${connect.connection.host}`);
        
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1);// 1 is failure, 0 status code is success
        
    }
}