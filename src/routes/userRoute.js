import express from "express";
import { register, logout, login, deleteProfile } from "../controllers/userController.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { adminRegister } from "../controllers/adminController.js";
import { userMiddleware } from "../middleware/userMiddleware.js";
const authRoute = express.Router();

// create Routes
authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/logout",userMiddleware, logout);

//admin register route
authRoute.post("/admin/register", adminMiddleware , adminRegister);

// delete profile 
authRoute.post("/profile",userMiddleware, deleteProfile);

export default authRoute;
