import problem from "../models/problemSchema.js";

import submission from "../models/submission.js";
import {
  getLanguageById,
  submitBatch,
  submitToken,
} from "../utils/problemUtility.js";

/* ================= submit code  ================= */

export const submitCode = async (req, res) => {
  // first we need user id and problem id
  try {
    const userId = req.user._id;

    const problemId = req.params.id;

    const { code, language } = req.body;

    if (!(userId && problemId && language && code))
      return res.status(400).send("Some field are missing");
    // Fetch the problem form db
    const problemData = await problem.findById(problemId);

    if (!problemData) return res.status(404).send("Problem not found");

    // testcase(hidden)

    const submitedResult = await submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testcasesTotal: problemData.hiddenTestCases.length,
    });
    // now  judge0 code submiting
    const languageId = getLanguageById(language);

    const submissions = problemData.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);

    const resultToken = submitResult.map((value) => value.token);
    // here is the test result present
    const testResult = await submitToken(resultToken);

    // submitresult is done here
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
        }
      }
    }

    // store the result in db  - and we can save by id

    submitedResult.status = status;
    submitedResult.testcasesPassed = testCasesPassed;
    submitedResult.runtime = runtime;
    submitedResult.memory = memory;
    submitedResult.errorMessage = errorMessage;

    await submitedResult.save();

    // problem -> userSchema -> problemSolved
    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);

      await req.result.save();
    }

    res.status(201).send(submitedResult);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

/* ================= RUN CODE  ================= */

export const runCode = async (req, re) => {
  try {
    const userId = req.user._id;

    const problemId = req.params.id;

    const { code, language } = req.body;

    if (!(userId && problemId && language && code))
      return res.status(400).send("Some field are missing");
    // Fetch the problem form db
    const problemData = await problem.findById(problemId);

    if (!problemData) return res.status(404).send("Problem not found");

    const languageId = getLanguageById(language);

    const submissions = problemData.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);

    const resultToken = submitResult.map((value) => value.token);
    // here is the test result present
    const testResult = await submitToken(resultToken);

    res.status(201).send(testResult);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


export const problemSolveByUser = async (req, res)=>{

  try {
    const userId = req.result.id;
    const problemId = req.params.pid;

    const ans = await submission.find({userId, problemId})

    if(!ans.length==0)
      res.status(200).send("No Submission is present")

    res.status(200).send(ans)

  } catch (error) {
    res.status(500).send('Internal server Error')
  }
}
// This API is working fine - but Becz of the Judge0  API limit over for it is throwing error
// in terminal but it is storing the data in DB - working
