import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    descripation:{
        type:String,
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            enum:["USD","EUR","GBP","JPY","INR"],
            default:"INR"
        }
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
},{timeseries:true})

const ProductModel = mongoose.model("product",productSchema);
export default ProductModel