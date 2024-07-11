import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION}`);
        console.log(`Database connected successfully, ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Connection failed", error);
        console.log(process.env.MONGODB_CONNECTION);
        process.exit(1);
    }
}

export default connectDB;