import express from "express";
const app = express();
import "dotenv/config";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/userRoute.js";




app.use(express.json())
app.use(cookieParser());
app.use('/user', authRoute)
 


app.get('/', function(req, res){
  res.send("bakend is working")
})







connectDB().then(async () => {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on the port : ${process.env.PORT}`);
  });
});
