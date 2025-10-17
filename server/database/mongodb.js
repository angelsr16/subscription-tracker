import mongoose from "mongoose";

if (!process.env.DB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env")
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log(`Connected to database in ${process.env.NODE_ENV} mode`)
    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit(1);
    }
}

export default connectToDatabase