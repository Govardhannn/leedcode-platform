import User from "../models/userModel.js";
import { validate } from "../utils/validater.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // Validate input data
    validate(req.body);

    const { fname, emailId, password } = req.body;

    //  Hash password BEFORE saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create user with hashed password
    const user = await User.create({
      fname,
      emailId,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, emailId },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 } 
    );

    //  
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, 
      httpOnly: true,
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
    });

  } catch (error) {
    console.error(error);

    // Correct status code for server error
    res.status(500).json({
      success: false,
      message: "Internal server error Govardhan",
    });
  }
};


export const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    //  Check input
    if (!(emailId && password)) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    //  Check if user exists
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //  Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, emailId },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 } 
    );

    // Set cookie
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, 
      httpOnly: true,
    });

    //  Success response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });

  } catch (error) {
    console.error(error);

    //  Correct server error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const logout = () => {
  try {
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Internal server error govardhan",
    });
  }
};
