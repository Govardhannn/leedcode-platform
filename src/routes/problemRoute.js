import express from "express";

export const problemRoute = express.Router();
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {userMiddleware} from "../middleware/userMiddleware.js"
import { createProblem, updateProblem, deleteProblem , getProblemById , getAllProblem, } from "../controllers/userProblem.js";

//create
problemRoute.post("/create" , adminMiddleware  , createProblem);
problemRoute.put("/update/:id", adminMiddleware, updateProblem);
problemRoute.delete("/delete/:id",adminMiddleware, deleteProblem);




problemRoute.get("/problemById/:id", userMiddleware, getProblemById);
problemRoute.get("/getAllProblem", userMiddleware, getAllProblem);
// problemRoute.get("/problemSolveByUser ",userMiddleware,  problemSolveByUser);
// fetch
// update

