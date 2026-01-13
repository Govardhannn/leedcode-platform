import express from "express"
const  submitRoute  = express.Router();
import { userMiddleware } from "../middleware/userMiddleware.js";
import { submitCode } from "../controllers/userSubmission.js";



submitRoute.post("/submit/:id", userMiddleware , submitCode)

export default submitRoute;