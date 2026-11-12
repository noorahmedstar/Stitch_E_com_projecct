import mongoose from "mongoose";
import { config } from "./config.js";

const connetTODB = async ()=>{
    await mongoose.connect(config.MONGO_URL)
    console.log("datat baseconnect")
}

export default connetTODB;