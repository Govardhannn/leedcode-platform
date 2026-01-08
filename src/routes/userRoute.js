import express from "express";
import { register, logout, login } from "../controllers/userController.js";
import { userMiddleware } from "../middleware/userMiddleware.js";
const authRoute = express.Router();

// create Routes
authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/logout", userMiddleware, logout);

export default authRoute;
