import express from "express"
const  submitRoute  = express.Router();
import { userMiddleware } from "../middleware/userMiddleware.js";
import { runCode, submitCode } from "../controllers/userSubmission.js";



submitRoute.post("/submit/:id", userMiddleware , submitCode)
submitRoute.post("/run/:id", userMiddleware ,runCode )

export default submitRoute;

