import axios from "axios";

export const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63,
  };
  return language(lang.toLowerCase());
};

export const submitBatch = async (submissions) => {
  const waiting = async (timer) => {
    setTimeout(() => {
      return 1;
    }, timer);
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
      "x-rapidapi-key": "4d61e9e0c6mshcbeee691acb81d7p16ef69jsn9de25c62bee7",
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
      console.error(error);
    }
  }
  while (true) {
    const result = await fetchData();

    const IsResultObtained = result.submissions.every((r) => r.status_id > 2);

    if (IsResultObtained) return result.submissions;

    await waiting(1000);
  }
};


export const submitToken = async(resultToken)=>{


  const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),  // becz it is a array , need to conver this to string
    base64_encoded: 'true',
    fields: '*'
  },   
  headers: {
    'x-rapidapi-key': '4d61e9e0c6mshcbeee691acb81d7p16ef69jsn9de25c62bee7',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
	return response.data
	} catch (error) {
		console.error(error);
	}
}

 const result = await fetchData();


}