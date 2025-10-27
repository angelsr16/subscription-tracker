import './config.js';
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: ["https://subscription-tracker-ashy.vercel.app","http://localhost:3000"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.set("trust proxy", 1);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => { res.send("Welcome to the Subscription Tracker API") });

app.listen(process.env.PORT, '127.0.0.1', async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${process.env.PORT}`);

    await connectToDatabase();
})

export default app;
