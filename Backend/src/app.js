import express, { application } from "express";
import morgan from "morgan";
import authRouter from './routes/auth.routes.js'
import productRouter from './routes/Product.routes.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import passport from 'passport'
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";

const app = express();
const frontendOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(morgan("dev"));
app.use(cors({
    origin: frontendOrigins,
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}));

app.use(cookieParser());
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL:config.GOOGLE_CALLBACK_URL

},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile);
}))

app.use(express.json());
app.use('/api/auth',authRouter)
app.use('/api/product',productRouter)

export default app;
