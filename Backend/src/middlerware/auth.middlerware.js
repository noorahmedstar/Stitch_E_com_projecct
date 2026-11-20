import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'
import userMOdel from "../models/user.model.js"

export const authenticateSeller = async (req,res,next)=>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({message:"unauthorized"})
    }

    try{
        const decoded = jwt.verify(token,config.JWT_SECRET)

        const user = await userMOdel.findById(decoded.id)
        if(!user){
             return res.status(401).json({message:"unauthorized"})
        }
        if(user.role !=='seller'){
             return res.status(401).json({message:"forbidden"})
        }
        req.user = user
        next()

    }catch(err){
        console.log(err);
         return res.status(401).json({message:"unauthorized"}) 

    }

}