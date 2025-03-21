import mongoose from "mongoose";

export const  connectDb = async()=>{
    try {
       const conn=  await mongoose.connect(process.env.Mongo_url)
       if(conn)
       {
        console.log("Connected successfully .")
       }
    } catch (error) {
        console.log("error Occured .")
        
    }
}