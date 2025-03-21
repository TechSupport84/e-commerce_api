import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import { connectDb } from "./config/db.js";
import cors from "cors";
import createError from "http-errors";
import swaggerRouter from "./routes/swagger.js";

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/", swaggerRouter);


app.use((req, res, next) => {
    next(createError(404, "Not found"));
});


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

 
const startServer = async () => {
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();
