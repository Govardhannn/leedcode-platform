import express from "express";
import { register, logout, login } from "../controllers/userController.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { adminRegister } from "../controllers/adminController.js";
const authRoute = express.Router();

// create Routes
authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/logout",  logout);

//admin register route
authRoute.post("/admin/register", adminMiddleware , adminRegister);

export default authRoute;
