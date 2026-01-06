import express from "express";

const problemRoute = express.Router();

// create a prblem  -> for Admin use
problemRoute.post("/create", problemCreate);
problemRoute.get("/:id", problemdelete);
problemRoute.patch("/:id", problemUpdate);


// here normal user can acess - by login
problemRoute.get("/",getAllProblem);
problemRoute.get("/:id", problemFetch);
problemRoute.get("/user", solveProblem);
// fetch
// update
// delete
//
