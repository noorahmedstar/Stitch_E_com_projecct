import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { config } from "dotenv";

async function sendTokeenRespones(user,res,meassage) {
    const token = jwt.sign({
        id:user._id
    },config.JWT.SECRET,{
        expiresIn:"7d"
    })

    res.cookie("token",token)
    res.status(200).json({
        token,
        user:{
            id:user._id,
            email:user.email,
            contact:user.contact,
            fullname:user.fullname,
            rote:user.role
        }
    })
}

export const register = async (req,res)=>{
    const {email,password,contact,fullname,isSeller}  = req.body;

    try{
        const existUser = await userModel.findOne({
            $or:[{email},{contact}]
        })

        if(existUser){return res.status(400).json({meassage:"user with this email or contact already exist"})}

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role:isSeller?"seller":"buyer"
        })
        await sendTokeenRespones(user,res,"register successfully");


    }catch(err){console.lof(err);
        return res.status(500).json({message:"server error "})
    }


}