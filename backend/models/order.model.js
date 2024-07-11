import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    food: [
        {
            type: Schema.Types.ObjectId,
            ref: "Menu",
        }
    ],
    orderStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],  // Possible status values
        default: 'pending',  // Default status
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;