import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URL){
    throw new Error("MONGO_URL environment variable is not defined.");
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET environment variable is not defined.");
}

export const config = {
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET
}