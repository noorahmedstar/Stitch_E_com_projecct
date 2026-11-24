import ProductModel from '../models/products.model.js'
import mongoose from 'mongoose'
import { uploadfile } from '../services/storage.service.js';

export async function CreateProduct(req,res) {
    try {
        const {name, category, description, price, stock} = req.body;
        const images = await Promise.all((req.files ?? []).map(async (file) => {
            const uploadedFile = await uploadfile({
                buffer:file.buffer,
                filename:file.originalname
            })
            return {
                url:uploadedFile.url,
                alt:file.originalname
            }
        }))

        const product = await ProductModel.create({
            name,
            category,
            description,
            price:Number(price),
            stock:Number(stock),
            images,
            seller:req.user._id
        })
        return res.status(201).json({
            message:"Product created successfully.",
            success:true,
            product
        })
    } catch (error) {
        console.error("Product creation failed:", error);
        return res.status(500).json({message:"Failed to create product."});
    }
}

export async function getSellerProductes(req,res) {
    try {
        const products = await ProductModel.find({seller:req.user._id}).sort({createdAt:-1});
        return res.status(200).json({
            message:"Products fetched successfully.",
            success:true,
            products
        })
    } catch (error) {
        console.error("Product fetch failed:", error);
        return res.status(500).json({message:"Failed to fetch products."});
    }
}

export async function deleteSellerProduct(req,res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message:"Invalid product ID."});
    }

    try {
        const product = await ProductModel.findOneAndDelete({
            _id:req.params.id,
            seller:req.user._id
        });
        if (!product) {
            return res.status(404).json({message:"Product not found."});
        }
        return res.status(200).json({message:"Product deleted successfully.",success:true});
    } catch (error) {
        console.error("Product deletion failed:", error);
        return res.status(500).json({message:"Failed to delete product."});
    }
}