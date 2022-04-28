PORT = 3000;

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const Joi = require("joi");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Validation

dotenv.config();
//Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

mongoose.connect(process.env.DB_CONNECT).then(() => {
  console.log("Connceted to MongoDB Atlas");
});
// Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () => {
  console.log("Listening at PORT : " + PORT);
});
