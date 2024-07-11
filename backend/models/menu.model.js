import mongoose, { Schema } from "mongoose";

const menuSchema = new mongoose.Schema({
    menu: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }
    ]
});

const Menu = mongoose.model('Menu', menuSchema);
export default Menu;