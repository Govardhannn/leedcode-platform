import { redisClient } from "../config/redis.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Token is not present" });
    }

    // Verify JWT
    const payload = jwt.verify(token, process.env.JWT_KEY);

   
    const { id } = payload;

 
    if (!id) {
      return res.status(401).json({ message: "Invalid Token govardhan" });
    }

    // checking if he is admin or not - this is new line only
    if(payload.role!="admin"){
        throw new Error ("Invalid admin token")
    }

    const result = await User.findById(id);

    if (!result) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    // Check if token is blocked in Redis
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({ message: "Token is blocked" });
    }

    // Attach user to request
    req.user = result;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};
