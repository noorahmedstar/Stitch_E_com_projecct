import { body, validationResult } from 'express-validator'


function validateRequest(req, res, next) {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.status(400).json({
            message: errors[0].msg,
            errors
        });
    }
    next();
}

export const validateRegisterUser = [
    body("email")
        .isEmail().withMessage("Invalid email format "),
    body("contact")
        .notEmpty().withMessage("contact is required ")
        .matches(/^\d{10}$/).withMessage("Contact must be a 10-digit number."),
    body('password')
        .isLength({ min: 6 }).withMessage("password must be atleast 6 charcters long"),
    body("fullname")
        .notEmpty().withMessage(" full name is required ")
        .isLength({ min: 3 }).withMessage("full name must contains atleast 3 charcaters long "),
    body("isSeller")
        .isBoolean().withMessage("isSeller must be a boolen value"),

    validateRequest
]

export const validateLoginUser = [
    body("email")
        .isEmail().withMessage("Invalid email format "),
    body('password')
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),

    validateRequest
]