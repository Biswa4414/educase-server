const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute.js");
const cors = require("cors");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
require("dotenv").config();

//IMPORT CONSTANT
const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middleware
app.use(express.json());
app.use(cors(
  {
    origin:["https://educase-client.vercel.app"],
    methods:["POST","GET"],
    credentials:true
  }
));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store, 
  })
);

//mongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongoDB connected Succesfully");
  })
  .catch((error) => {
    console.log(error);
  });

//API

app.use("/auth", userRoute);

app.get("/", (req, res) => {
  return res.send("Server is running");
});


app.listen(PORT, () => {
  console.log(`app is listening to port: ${PORT}`);
});
