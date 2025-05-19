import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import foodRouter from './routers/food.router';
import userRouter from './routers/user.router';
import orderRouter from './routers/order.router';
import { dbConnect } from './configs/database.config';
dbConnect();

const app = express();

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200", "https://goodfoodmood.onrender.com", process.env.FRONTEND_URL || "*"]
}));

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.get('/', (req, res) => {
    res.send('GoodFoodMood API is running! Access the API at /api/foods, /api/users, or /api/orders.');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})