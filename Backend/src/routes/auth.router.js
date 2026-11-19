import { Router } from "express";
import { validateRegisterUser ,validateLoginUser} from "../validator/auth.validator.js";
import { register,login,googleAuthCallback } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router()

router.post("/register",validateRegisterUser,register);
router.post("/login",validateLoginUser,login)
router.get(
    "/google",
    (req,res,next) => {
        res.cookie("googleAuthRole",req.query.role === "seller" ? "seller" : "buyer",{
            httpOnly:true,
            sameSite:"lax",
            secure:process.env.NODE_ENV === "production",
            maxAge:5 * 60 * 1000,
            path:"/api/auth/google/callback"
        });
        next();
    },
    passport.authenticate("google",{scope:["profile","email"]})
)
router.get(
    "/google/callback",
    passport.authenticate("google",{
        session:false,
        failureRedirect:`${config.FRONTEND_URL}/login?error=google_auth_failed`
    }),
    googleAuthCallback
)

export default router;