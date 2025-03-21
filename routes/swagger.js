import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const router = express.Router();

const swaggerFilePath = path.resolve("swagger.json");

let swaggerDocument;
try {
    swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
} catch (error) {
    console.error("Error loading Swagger file:", error.message);
    swaggerDocument = {};
}

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
