import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/config.js";

function sendTokenResponse(user, res) {
    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    })
    return res.status(201).json({
        token,
        user:{
            id:user._id,
            email:user.email,
            contact:user.contact,
            fullname:user.fullname,
            role:user.role
        }
    })
}

export const register = async (req,res)=>{
    const {email,password,contact,fullname,isSeller}  = req.body;

    try{
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedContact = contact.trim();
        const existUser = await userModel.findOne({
            $or:[{email: normalizedEmail},{contact: normalizedContact}]
        })

        if(existUser){
            return res.status(409).json({message:"An account with this email or contact already exists."})
        }

        const user = await userModel.create({
            email: normalizedEmail,
            contact: normalizedContact,
            password,
            fullname,
            role:isSeller?"seller":"buyer"
        })
        return sendTokenResponse(user,res);


    }catch(err){
        console.error("Registration failed:", err);
        if (err?.code === 11000) {
            return res.status(409).json({message:"An account with this email or contact already exists."})
        }
        return res.status(500).json({message:"server error "})
    }


}