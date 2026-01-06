import mongoose, { connect } from "mongoose";

const connectDB = async function () {
  await mongoose.connect(process.env.DB_CONN, {
    dbName: "leedcode-project",
  });

  console.log(`DB conneted sucessfully`);
};

export default connectDB;
