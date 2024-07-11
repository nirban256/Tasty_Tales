import mongoose, { Schema } from "mongoose";

const ordersSchema = new mongoose.Schema({
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
});

const Orders = mongoose.model('Orders', ordersSchema);
export default Orders;