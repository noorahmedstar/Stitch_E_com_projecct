import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        min:0
    },
    images:[{
        url:{
            type:String,
            required:true
        },
        alt:{
            type:String,
            required:true
        }
    }]
},{timestamps:true})

const ProductModel = mongoose.model("product",productSchema);
export default ProductModel