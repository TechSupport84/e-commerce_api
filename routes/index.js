import express from "express";
import swagger from "./routes/swagger.js";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";

const routes = express.Router();

routes.use("/", swagger);
routes.use("/user", userRouter);
routes.use("/product", productRouter);


routes.get("/docs-info", (req, res) => {
  res.json({ documentationURL: "http://localhost:5002/api-docs" });
});

export default routes;
