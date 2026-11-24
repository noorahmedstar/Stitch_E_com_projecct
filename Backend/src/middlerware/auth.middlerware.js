import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'
import userMOdel from "../models/user.model.js"

export const authenticateSeller = async (req,res,next)=>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message:"Please sign in to manage products."})
    }

    try{
        const decoded = jwt.verify(token,config.JWT_SECRET)

        const user = await userMOdel.findById(decoded.id)
        if(!user){
             return res.status(401).json({message:"Your session is invalid. Please sign in again."})
        }
        if(user.role !=='seller'){
             return res.status(403).json({message:"A seller account is required to manage products."})
        }
        req.user = user
        next()

    }catch(err){
        console.error("Seller authentication failed:", err);
         return res.status(401).json({message:"Your session is invalid or expired. Please sign in again."})

    }

}