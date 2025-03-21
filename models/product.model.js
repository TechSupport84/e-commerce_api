import mongoose  from "mongoose";


const  productShema = new  mongoose.Schema({
    name:{type:String},
    description:{type:String},
    image:{type:String},
    category:{type:String,enum:["clothing", "electronics"]},
    price:{type:Number, required:true},
    location:{type:String},
    brand:{type:String},
},{timestamps:true})
export const Product = mongoose.model("Product",productShema)
