import express from "express";

const problemRoute = express.Router();

//create
problemRoute.post("/create", createProblem);
problemRoute.get("/:id", updateProblem);
problemRoute.patch("/:id", deleteProblem);



problemRoute.get("/",getAllProblemById);
problemRoute.get("/:id", getAllProblem);
problemRoute.get("/user", solveProblem);
// fetch
// update
// delete
//
