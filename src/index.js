//First method is creating another file inside the db folder and callin in here(More Preferable approach):

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB();

//Second approach for connecting database is directly in the index.js file(Less preferable)
// import express from "express";
// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error in db connection", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on PORt ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Error connecting database", error);
//     throw error;
//   }
// })();
