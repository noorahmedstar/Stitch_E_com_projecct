import {body,validationResult} from  "express-validator"

function validateRequest (req,res,next){
    const err = validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).json({
            message:"validation error",
        })
    }
    next()
    
}
export const createProductValidator = [
    body('title').notEmpty().withMessage("title is required"),
    body('descripation').notEmpty().withMessage("descripation is required"),
    body('price').notEmpty().withMessage("price is required").isNumeric().withMessage("price must be a number"),
    validateRequest
]