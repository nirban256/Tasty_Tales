import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    itemPrice: {
        type: Number,
        required: true,
    }
});

const Item = mongoose.model('Item', itemSchema);
export default Item;