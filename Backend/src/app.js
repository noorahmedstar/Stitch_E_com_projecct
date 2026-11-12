import express from "express";
import morgan from "morgan";
import authRouter from './routes/auth.router.js'
import cors from 'cors'

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

app.use(express.json());
app.use('/api/auth',authRouter)

export default app;
