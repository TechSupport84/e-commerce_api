import { Product } from "../models/product.model.js";
import createError from "http-errors";
import validateProductData from "../utils/validation_products.js"



const addProduct = async (req, res, next) => {
    try {
      const products = await validateProductData.validateAsync(req.body);
  
      if (!products) {
        return  next(createError(400, "All fields required."));
      }
  
      const imageUrl = req.file ? req.file.path : req.body.image;
  
      const newProduct = new Product({
        name: products.name,
        description: products.description,
        image: imageUrl,
        category: products.category,
        price: products.price,
        location: products.location,
        brand: products.brand,
      });
  
      await newProduct.save();
      res.status(201).json({
        success: true,
        message: "Product created!",
        product: newProduct,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      next(createError(500, "Internal Server Error"));
    }
  };

const getproductById = async(req, res, next)=>{
  const {id} =req.params;
  try {
    const producID = await Product.findById(id)
    if(!producID)
    {
      return next(createError(404), "No Id  found")
    }
    res.status(200).json({success:true, product: producID})
  } catch (error) {
    console.error("Error retrieving  product:", error);
    next(createError(500, "Internal Server Error"));
  }
}

const  getProducts = async(req, res, next) =>{
  try {
    const products = await Product.find({})
    if(!products)
    {
        return next(createError(404, "No products found!"))
    }

    res.status(200).json({success:true,products:products})
  } catch (error) {
     return next(createError(500, "Internal error occured."))
  }
}

const updateProduct = async(req ,res, next)=>{

try {
    const {id} = req.params;
    const productData =  await validateProductData.validateAsync(req.body)
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, {new:true})
   
    if(!updatedProduct)
    {
        return next(createError(404, "Products not found!"))
    }
    res.status(200).json({
        success: true,
        message: "Product updated successfully!",
        product: updatedProduct,
      });

} catch (error) {
    console.error("Error updating product:", error);
    next(createError(500, "Internal Server Error"));
  
}
}

const deleteProduct = async(req, res, next)=>{
    const {id} = req.params;
    try {
        const productId = Product.findByIdAndDelete(id)
        if(!productId)
        {
            return next(createError(404, "Product No found"))

        }
        res.status(200).json({success:true, message:"Product deleted successfully ! "})
    } catch (error) {
        console.error("Error deleting product:", error);
        next(createError(500, "Internal Server Error"));
    }

}

export{addProduct, getProducts, updateProduct, deleteProduct, getproductById}