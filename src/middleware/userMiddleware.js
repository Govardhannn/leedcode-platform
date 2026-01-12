import { redisClient } from "../config/redis.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const userMiddleware = async (req, res, next) => {
  try {
    // Get token from cookie OR Authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is not present" });
    }

    // Verify JWT
    const payload = jwt.verify(token, process.env.JWT_KEY);

    const { id } = payload;

    if (!id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check if token is blocked in Redis (before DB lookup)
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({ message: "Token is blocked" });
    }

    // Check if user exists
    const result = await User.findById(id);
    if (!result) {
      return res.status(401).json({ message: "User doesn't exist" });
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
