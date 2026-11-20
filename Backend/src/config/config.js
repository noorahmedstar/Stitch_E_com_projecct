import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URL){
    throw new Error("MONGO_URL environment variable is not defined.");
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET environment variable is not defined.");
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID environment variable is not defined.");
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET environment variable is not defined.");
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY environment variable is not defined.");
}

export const config = {
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    FRONTEND_URL:(process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, ""),
    GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL || `${(process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, "")}/api/auth/google/callback`,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
}