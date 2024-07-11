import express from "express";
import Order from "../models/order.model.js";
import Orders from "../models/orders.model.js";
import Menu from "../models/menu.model.js";

const router = express.Router();

router.post('/add-order', async (req, res) => {
    try {
        const { fullName, email, food } = req.body;

        const orderFood = await Order.create({
            fullName,
            email,
            food,
            orderStatus: "pending"
        });
        await orderFood.save();

        let orders = await Orders.findOne();
        if (!orders) {
            orders = new Order({ orders: [] })
        }

        orders.orders.push(orderFood._id);
        await orders.save();

        res.status(201).json(orderFood);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Orders.find().populate('orders').exec();

        res.status(201).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/items', async (req, res) => {
    try {
        const menu = await Menu.find().populate('menu').exec();
        res.status(201).json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/orders/:ordersId/order/:orderId', async (req, res) => {
    try {
        const { ordersId, orderId } = req.params;
        const update = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            update,
            { new: true }
        );

        const orders = await Orders.findById(ordersId);
        if (!orders) {
            return res.status(404).json({ message: "Order not found in Orders" });
        }

        const orderIndex = orders.orders.findIndex(order => order.toString() === orderId);
        if (orderIndex === -1) {
            orders.orders[orderIndex] = updatedOrder._id;
        }
        await orders.save();

        res.status(201).json(updatedOrder);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/orders/:ordersId/order/:orderId', async (req, res) => {
    try {
        const { ordersId, orderId } = req.params;

        console.log(`Deleting order with ID: ${orderId}`);
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            console.log(`Order with ID ${orderId} not found`);
            return res.status(404).json({ message: "Order not found in order collection" });
        }

        console.log(`Finding orders document with ID: ${ordersId}`);
        const orders = await Orders.findById(ordersId);
        if (!orders) {
            console.log(`Orders document with ID ${ordersId} not found`);
            return res.status(404).json({ message: "Orders document not found" });
        }

        console.log(`Removing order with ID: ${orderId} from orders document`);
        orders.orders = orders.orders.filter(order => order.toString() !== orderId);
        await orders.save();

        console.log(`Order with ID ${orderId} deleted successfully`);
        return res.status(200).json({ message: "Order deleted from orders and order collection" });
    } catch (error) {
        console.log(`Error occurred: ${error.message}`);
        return res.status(500).json({ message: error.message });
    }
});

export default router;