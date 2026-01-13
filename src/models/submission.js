import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "java", "typescript"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "wrong", "error"],
      default: "pending",
    },
    runtime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testcasesPassed: {
      type: Number,
      default: 0,
    },
    testcasesTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const   submission = mongoose.model("submissions", submissionSchema);
export default submission;
