import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { config } from "dotenv";

async function sendTokeenRespones(user,res) {
    const token = jwt.sign({
        id:user._id
    },config.JWT.SECRET)
    
}

export const register = async (req,res)=>{
    const {email,password,contact,fullname}  = req.body;

    try{
        const existUser = await userModel.findOne({
            $or:[{email},{contact}]
        })

        if(existUser){return res.status(400).json({meassage:"user with this email or contact already exist"})}

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname
        })


    }catch(err){console.lof(err);
        return res.status(500).json({message:"server error "})
    }


}