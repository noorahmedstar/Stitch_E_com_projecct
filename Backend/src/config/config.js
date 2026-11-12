import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URL){
    throw console.error("MONGO_URL variable not defined ");
    
}
if(!process.env.JWT_SECRET){
    throw console.error("JWT_SECRET variable not defined ");
    
}

export const config = {
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET
}