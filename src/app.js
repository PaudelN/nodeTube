import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
//app.use() is generally for the middlewares

//to connect the frontend url with our backend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//to allow data from frontend such as forms,json data etc
//to allow data such as images we use multer
app.use(
  express.json({
    limit: "16kb",
  })
);

//to allow data from url
//The url encoded for space (_) is %20 and so on every character have a unique url encoded
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

//to store the allowed files and folders from any type of data in public asset
app.use(express.static("public")); //public is the name of the folder created before, which means i wanna keep files or folders in this folder named "public"

//use of cookieParser in backend is to allow the backend engineer to access the cookies set in the user's browser and also allow to set the new cookie for the user.
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users",userRouter)


export { app };
