import mongoose from "mongoose";
import { MONGO_URI } from "./env.config.js";

mongoose.set("strictQuery",false);

export const dbConnect=():void=>{
    try{
        const conn = mongoose.connect(MONGO_URI as string);
        console.log("Database connected successfully");
    }catch(error){
        console.log("Database error");
    }
};

