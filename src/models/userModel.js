import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lname: {
      type: String,
      
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 5,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemSolve: {
      tyep: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
