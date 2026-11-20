import ProductModel from '../models/products.model.js'
import { uploadfile } from '../services/storage.service.js';

export async function CreateProduct(req,res) {

    const {title, descripation ,price} = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
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
        title,
        descripation,
        price:{
            amount:price,
            currency:"INR"
        },
        images,
        seller:seller._id
    })
    res.status(201).json({
        measage:"product created succfuly",
        success:true,
        product
    })

    
}