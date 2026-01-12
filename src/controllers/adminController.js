
import User from "../models/userModel.js";
import { validate } from "../utils/validater.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminRegister = async (req, res) => {
  try {

    
    // Validate input data
    validate(req.body);

    const { fname, emailId, password, lname } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create user with hashed password and admin role
    const user = await User.create({
      fname,
      lname,
      emailId,
      password: hashedPassword,
      role: "admin",
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
      }
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
      message: "User already exist ",
    });
  }
};
