import Express from 'express'
import { authenticateSeller } from "../middlerware/auth.middlerware.js";
import { CreateProduct } from "../controllers/product.controller.js";
import multer from 'multer';


const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5 * 1024 * 1024
     }
})

const router = Express.Router();


router.post('/',authenticateSeller,createProductValidator,upload.array('images',7),CreateProduct)

export default router