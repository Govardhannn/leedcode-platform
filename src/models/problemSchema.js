import mongoose, { Schema } from "mongoose";

const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
  tags: {
    type: String,
    enum: ["array", "linkedList", "graph", "dp"],
    required: true,
  },
  visibleTestCases: {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
  },
 
  hiddenTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],
  startCode: {
    language: {
      type: String,
      required: true,
    },
    initialcode: {
      type: String,
      required: true,
    },
  },
  problemCreator: {
    type: Schema.Types.ObjectId, // here refferring the schema from userModels
    ref: "user",
    required: true,
  },
  referenceSolution: [
    {
      language: {
        type: String,
        required: true,
      },
      completeCode: {
        type: String,
        required: true,
      },
    },
  ],
});


const problem = mongoose.model("problem", problemSchema);

export default problem;
