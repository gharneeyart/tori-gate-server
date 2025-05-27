import mongoose from "mongoose";
import Property from "./src/models/property.js";
import properties from './data.json' assert { type: 'json' };
import dotenv from 'dotenv';
dotenv.config();

const populate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Property.deleteMany(); // Clear existing properties
        await Property.insertMany(properties); // Insert new properties
        console.log("Database populated successfully with properties.");
    } catch (error) {
        console.log("Error populating database:", error);
    }
}
populate();