import express from "express";
const app = express();
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoute from "./routes/userRoute.js";
import { redisClient } from "./config/redis.js";
import connectDB from "./config/db.js";

app.use(express.json());
app.use(cookieParser());
app.use("/user", authRoute);



const InitalizeConnection = async () => {
  try {
    await Promise.all([connectDB(), redisClient.connect()]);
    console.log("DB connected");

    app.listen(process.env.PORT, () => {
      console.log(`server is running on the port : ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};
InitalizeConnection();

// connectDB().then(async () => {

// });
