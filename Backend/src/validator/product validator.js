import {body,validationResult} from  "express-validator"

function validateRequest (req,res,next){
    const errors = validationResult(req).array();
    if(errors.length > 0){
        return res.status(400).json({
            message:errors[0].msg,
            errors
        })
    }
    next()
    
}
export const createProductValidator = [
    body('name').trim().notEmpty().withMessage("name is required"),
    body('category').trim().notEmpty().withMessage("category is required"),
    body('description').trim().notEmpty().withMessage("description is required"),
    body('price').isFloat({ min: 0 }).withMessage("price must be a non-negative number"),
    body('stock').isInt({ min: 0 }).withMessage("stock must be a non-negative integer"),
    validateRequest
]