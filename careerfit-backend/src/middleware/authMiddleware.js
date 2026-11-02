import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next){
    try{
        const token = req.cookies?.careerfit_token;

        if(!token){
            return res.status(401).json({
                message: "Please log in to acess this resource",
            });
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        
        if(!decoded.userId){
            return res.status(401).json({
                message: "Invalid token. Please log in again.",
            });
        }

        const user = await User.findById(decoded.userId);

        if(!user){
            return res.status(401).json({
                message: "User account no longer exists"
            });
        }

        req.user = user;
        next();
    }catch(error){
        if((
            error.name === "JsonWebTokenError"||
            error.name ==="Tokem Expired Error"
        )){
            return res.status(401).json({
                message: "Invalid or expired token. Please log in again.",
            });
        }

        next(error);
    }
}