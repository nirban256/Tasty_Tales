import express from "express";
import dotenv from "dotenv";
import router from "./routes/user.routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db/index.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();
dotenv.config();

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(`Error: ${error}`);
        });

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB Connection failed ", error);
    });

app.get('/', (req, res) => {
    res.send("Hello from server!");
});

app.use(cors());
app.use(bodyParser.json());

// user routes
app.use('/api/orders', router);

// admin routes
app.use('/api/admin', adminRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
