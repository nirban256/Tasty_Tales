import express from "express";
import Item from "../models/item.model.js";
import Menu from "../models/menu.model.js";

const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
    res.status(200).json("This is the admin route");
});

adminRouter.get('/items', async (req, res) => {
    try {
        const menu = await Menu.find().populate('menu').exec();
        res.status(201).json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

adminRouter.post('/add', async (req, res) => {
    try {
        const { itemName, itemPrice } = req.body;

        const newItem = await Item.create({
            itemName,
            itemPrice
        });

        if (!newItem) res.status(400).json("Please provide all the necessary fields");

        await newItem.save();
        let menu = await Menu.findOne();

        if (!menu) {
            menu = new Menu({ menu: [] });
        }

        menu.menu.push(newItem._id);
        await menu.save();

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

adminRouter.patch('/menu/:menuId/item/:itemId', async (req, res) => {
    try {
        const { menuId, itemId } = req.params;
        const update = req.body;
        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            update,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        const menu = await Menu.findById(menuId);
        if (!menu) {
            return res.status(404).json({ message: "Item not foundin Menu" });
        }

        const itemIndex = menu.menu.findIndex(item => item.toString() === itemId);
        if (itemIndex !== -1) {
            menu.menu[itemIndex] = updatedItem._id;
        }

        await menu.save();
        res.status(200).json(updatedItem);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
})

adminRouter.delete('/menu/:menuId/item/:itemId', async (req, res) => {
    try {
        const { menuId, itemId } = req.params;
        await Item.findByIdAndDelete(itemId);

        const menu = await Menu.findById(menuId);

        if (!menu) res.status(404).json({ message: "Menu not found" });

        menu.menu = menu.menu.filter(item => item.toString() !== itemId);
        await menu.save();

        res.status(200).json({ message: "Item deleted from menu and Item collection" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
})

export default adminRouter;