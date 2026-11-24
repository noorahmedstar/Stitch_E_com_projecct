import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/config.js";

function setAuthCookie(user, res) {
    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth"
    })
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return token;
}

function sendTokenResponse(user, res, status = 201) {
    const token = setAuthCookie(user, res);
    return res.status(status).json({
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

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email.trim().toLowerCase() });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        return sendTokenResponse(user, res, 200);
    } catch (err) {
        console.error("Login failed:", err);
        return res.status(500).json({ message: "Server error." });
    }
};

export const googleAuthCallback = async (req, res) => {
    try {
        const profile = req.user;
        const role = req.cookies?.googleAuthRole === "seller" ? "seller" : "buyer";
        res.clearCookie("googleAuthRole",{
            httpOnly:true,
            sameSite:"lax",
            secure:process.env.NODE_ENV === "production",
            path:"/api/auth/google/callback"
        });
        const verifiedEmail = profile.emails?.find((item) => item.verified)?.value;
        if (!verifiedEmail || !profile.id) {
            return res.redirect(`${config.FRONTEND_URL}/login?error=google_email_unverified`);
        }

        const email = verifiedEmail.trim().toLowerCase();
        let user = await userModel.findOne({
            $or: [{ googleId: profile.id }, { email }]
        });

        if (user?.googleId && user.googleId !== profile.id) {
            return res.redirect(`${config.FRONTEND_URL}/login?error=google_account_conflict`);
        }

        if (!user) {
            user = await userModel.create({
                email,
                fullname: profile.displayName || email,
                googleId: profile.id,
                role
            });
        } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
        }

        setAuthCookie(user, res);
        return res.redirect(config.FRONTEND_URL);
    } catch (err) {
        console.error("Google authentication failed:", err);
        if (err?.code === 11000) {
            return res.redirect(`${config.FRONTEND_URL}/login?error=google_account_conflict`);
        }
        return res.redirect(`${config.FRONTEND_URL}/login?error=google_auth_failed`);
    }
};