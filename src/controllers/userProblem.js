import problem from "../models/problemSchema.js";
import User from "../models/userModel.js";
import {
  getLanguageById,
  submitBatch,
  submitToken,
} from "../utils/problemUtility.js";


/* ================= CREATE PROBLEM  ================= */

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    problemCreator,
    referenceSolution,
  } = req.body;

  try {
    // Basic validation for reference solution and test cases to avoid runtime errors
    if (!referenceSolution) {
      return res
        .status(400)
        .send("Reference solution is required");
    }

    const referenceSolutions = Array.isArray(referenceSolution)
      ? referenceSolution
      : [referenceSolution];

    if (!visibleTestCases) {
      return res
        .status(400)
        .send("Visible test cases are required");
    }

    // Validate reference solution with test cases
    try {
      for (const { language, completeCode } of referenceSolutions) {
        const languageId = getLanguageById(language);

        if (!languageId) {
          return res
            .status(400)
            .send("Invalid language in reference solution");
        }

        // If visibleTestCases is a single object, wrap it in array
        const testCases = Array.isArray(visibleTestCases)
          ? visibleTestCases
          : [visibleTestCases];

        const submissions = testCases.map((testcase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);
       

        for (const test of testResult) {
          if (test.status_id !== 3)
            return res.status(400).send("Error Occurred in Test Case");
        }
      }
      
    } catch (error) {
      // If Judge0 returns 403 (not subscribed / key issue), skip validation but continue problem creation
      if (error?.response?.status === 403) {
        console.error(
          "Judge0 subscription / key error while validating problem:",
          error?.response?.data || error.message
        );
      } else {
        throw error;
      }
    }

    // Store in DB
    const userProblem = await problem.create({
      ...req.body,
      problemCreator: req.user._id,
    });

    res.status(201).send("Problem saved successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};


/* ================= UPDATE PROBLEM ================= */
export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    problemCreator,
    referenceSolution,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).send("Missing Id field");
    }

    const DsaProblem = await problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).send("ID is not present in server");
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      const testCases = Array.isArray(visibleTestCases)
        ? visibleTestCases
        : [visibleTestCases];

      const submissions = testCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id !== 3)
          return res.status(400).send("Error Occurred in Test Case");
      }
    }

    const newProblem = await problem.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(200).send(newProblem);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};

/* ================= DELETE PROBLEM ================= */
export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("ID is Missing");

    const deletedProblem = await problem.findByIdAndDelete(id);
    if (!deletedProblem)
      return res.status(404).send("Problem not found");

    res.status(200).send("Successfully Deleted");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

/* ================= GET PROBLEM BY ID ================= */
export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("ID is Missing");

    // .Select - this pring only thing mention in it breaces (-Hiddencase ) another case 
    const getProblem = await problem.findById(id).select(' id  title description difficulty tags visibleTestCases referenceSolution startCode  ')
    if (!getProblem)
      return res.status(404).send("Problem not found");

    res.status(200).send(getProblem);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};

/* ================= GET ALL PROBLEMS ================= */
export const getAllProblem = async (req, res) => {
  try {
    const getProblem = await problem.find({}).select("id titlr difficulty tags  ")

    if (getProblem.length === 0)
      return res.status(404).send("No problems found");

    res.status(200).send(getProblem)
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};

/* ================= GETSUBMITED PROBLEM ================= */

export const submitedProblem = async (req, res) => {
  try {

    const userId  = req.result.id;
    

    const user = await User.findById(userId).populate({
      path:'problemSolved',
      select:"_id title difficulty tags"
    })
    
    res.status(200).send(user)

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
