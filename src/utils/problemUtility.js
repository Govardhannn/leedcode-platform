import axios from "axios";

export const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63,
  };
  return language[lang.toLowerCase()];
};

export const submitBatch = async (submissions) => {
  const waiting = (timer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, timer);
    });
  };
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: {
      base64_encoded: "true",
      wait: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      // Surface Judge0 errors so callers can decide how to handle them
      console.error("Judge0 submitBatch error:", error?.response?.data || error.message);
      throw error;
    }
  }
  while (true) {
    const result = await fetchData();

    if (!result || !result.submissions) {
      throw new Error("Invalid response from Judge0 in submitBatch");
    }

    const IsResultObtained = result.submissions.every((r) => r.status_id > 2);

    if (IsResultObtained) return result.submissions;

    await waiting(1000);
  }
};


export const submitToken = async(resultToken)=>{



const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),  // becz it is a array , need to conver this to string
    base64_encoded: 'true',
    fields: '*'
  },   
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Judge0 submitToken error:", error?.response?.data || error.message);
    throw error;
  }
}

 const result = await fetchData();

 if (!result || !result.submissions) {
  throw new Error("Invalid response from Judge0 in submitToken");
 }

 return result.submissions;

} 