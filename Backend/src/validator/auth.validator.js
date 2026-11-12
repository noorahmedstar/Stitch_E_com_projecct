import { body, validationResult } from 'express-validator'


function validateRequest(req,res,next){
    const err = validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).json({
            error:err.array()
        });
    }
    next();
}

export const validateRegisterUser = [
    body("email")
        .isEmail().withMessage("Invalid email format "),
    body("contact")
        .notEmpty().withMessage("contact is required ")
        .matches(/^\d{10}/).withMessage(" contant must be 10-digit number "),
    body('password')
        .isLength({min:6}).withMessage("password must be atleast 6 charcters long"),
    body("fullname")
        .notEmpty().withMessage(" full name is required ")
        .isLength({min:3}).withMessage("full name must contains atleast 3 charcaters long "),

    validateRequest
]   