import { redisClient } from "../config/redis.js";
import submission from "../models/submission.js";
import User from "../models/userModel.js";
import { validate } from "../utils/validater.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registering the User 
export const register = async (req, res) => {
  try {
    // Validate input data
    validate(req.body);

    const { fname, lname, emailId, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role
    const user = await User.create({
      fname,
      lname,
      emailId,
      password: hashedPassword,
      role: "user",
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });

    // Success response
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// logIn User Route 
export const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Check input
    if (!(emailId && password)) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

  
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });

   
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout User Route 
export const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_KEY);

    // Store blocked token in Redis (NO SPACE in key)
    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    // Clear cookie
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// profile deleting here 
export const deleteProfile = async (req, res)=>{
   
  try {
    const userId = req.result.id;
    // userSchema delete
await User.findByIdAndDelete(userId)

// submission se bhi delete karo ...
submission.deleteMany({userId});

res.status(200).send("delted sucessfully")
    
  } catch (error) {
    res.status(500).send("Internal server error")
    
  }
}