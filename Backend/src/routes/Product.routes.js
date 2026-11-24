import Express from 'express'
import { authenticateSeller } from "../middlerware/auth.middlerware.js";
import { CreateProduct, deleteSellerProduct, getSellerProductes } from "../controllers/product.controller.js";
import multer from 'multer';
import { createProductValidator } from '../validator/product validator.js';


const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5 * 1024 * 1024
     }
})

const router = Express.Router();


router.post('/',authenticateSeller,upload.array('images',7),createProductValidator,CreateProduct)

router.get('/',authenticateSeller,getSellerProductes)
router.get('/seller',authenticateSeller,getSellerProductes)
router.delete('/:id',authenticateSeller,deleteSellerProduct)

export default router