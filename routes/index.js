import express from "express";
import swagger  from "./swagger.js"

import userRouter from "./user.js"
import productRouter from "./product.js"

const routes = express.Router();

routes.use('/', swagger);
routes.use('/user', userRouter);
routes.use('/product', productRouter);
routes.use(
  '/',
  (docData = (req, res) => {
    let docData = {
      documentationURL: 'http://localhost:5002/api/product/',
    };
    res.send(docData);
  })
);

module.exports = routes;