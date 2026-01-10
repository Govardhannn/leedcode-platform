import problem from "../models/problemSchema.js";
import {
  getLanguageById,
  submitBatch,
  submitToken,
} from "../utils/problemUtility.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    viaiableTestCases,
    hiddenTestCases,
    strartCode,
    problemCreator,
    referenceSolution,
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      // sourcd_code
      //language_id
      //stdin
      //expectedOutput

      const languageId = getLanguageById(language); // created in utils file

      const submissions = viaiableTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.expected_output,
      }));

      const submitResult = await submitBatch(submissions);  // created in utils file
      // console.log(submissionBatch)

      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);   // created in utils file

      for (const test of testResult) {
        if (test.status_id != 3) return res.status(400).send("Error Occured ");
      }
    }
    // we can store it in out DB
    const userProblem = await problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });
    res.status(201).send("Problem solve Sucessfully");
  } catch (error) {
    res.status(400).send("Error:" + error);
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    viaiableTestCases,
    hiddenTestCases,
    strartCode,
    problemCreator,
    referenceSolution,
  } = req.body;

  try {
    // checking the id
    if (!id) {
      return res.status(401).send("Missing Id field");
    }
    // checking if id is alredy or not there in db
    const DsaProblem = await problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).send("ID is not persent in server");
    }

    for (const { language, completeCode } of referenceSolution) {
      // sourcd_code
      //language_id
      //stdin
      //expectedOutput

      const languageId = getLanguageById(language);

      const submissions = viaiableTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.expected_output,
      }));

      const submitResult = await submitBatch(submissions);
      // console.log(submissionBatch)

      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id != 3) return res.status(400).send("Error Occured ");
      }
    }
    // we can store it in out DB
    const newProblem = await problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { renVlidators: true },
      { new: true }
    );

    req.status(200).send(newProblem);
  } catch (error) {
    res.status(500).send("Error:" + error);
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("ID is Missing ");

    const deletedProblem = await problem.findByIdAndDelete(id);

    if (!deletedProblem) return res.status(404).send("Problem is missing");

    res.status(200).ssend("Sucessfully Deleted");
  } catch (error) {
    res.status(400).send("Error:" + error);
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("ID is Missing ");

    const getProblem = await problem.findById(id);

    if (!getProblem) return res.status(404).send("Problem is missing");

    res.status(200).ssend(getProblem);
  } catch (error) {
    res.status(500).send("Error:" + error);
  }
};

export const getAllProblem = async (req, res) => {
  try {
    // getting all the problem in the {} in this object 
    const getProblem = await problem.findById({});

    if (!getProblem.length ===0)
       return res.status(404).send("Problem is missing");

    res.status(200).ssend(getProblem);
  } catch (error) {
    res.status(500).send("Error:" + error);
  }
};


// export const solveProblem = async (req, res) =>{
  

// }