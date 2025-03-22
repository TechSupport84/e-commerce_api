import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import createError from "http-errors";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import swaggerUi from "swagger-ui-express";
import swaggerRouter from "./routes/swagger.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const swaggerFilePath = path.resolve("swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", swaggerRouter)

app.use((req, res, next) => {
    next(createError(404, "Not found"));
});


app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


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
