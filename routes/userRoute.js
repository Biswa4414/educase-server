const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");

//file-imports
const userModel = require("../models/userModel.js");
const { cleanupAndValidate } = require("../utils/authUtils.js");

//Route for Register
router.post("/register", async (req, res) => {
  const { name, phone, email, password, company } = req.body;
  //data validation

  try {
    await cleanupAndValidate({ name, phone, email, password, company });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Validation Failed",
      error: error,
    });
  }

  const userEmailExist = await userModel.findOne({ email: email });

  if (userEmailExist) {
    return res.send({
      status: 400,
      message: "Email already exist",
      emailExists: true,
    });
  }

  //hashing the password

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );

  //store data in DB
  const userObj = new userModel({
    //schema key : value
    name: name,
    phone: phone,
    email: email,
    password: hashedPassword,
    company: company,
  });

  try {
    const userDb = await userObj.save();
    console.log("Register Successfully");
    return res.send({
      status: 200,
      message: "Register Successfully",
      data: userDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Data base error",
      error: error,
    });
  }
});

//Route for Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //find the user with loginId

  try {
    let userDb;
    if (validator.isEmail(email)) {
      userDb = await userModel.findOne({ email: email });
      if (!userDb) {
        return res.send({
          status: 400,
          message: "Email not found",
          exists: false,
        });
      }
    }

    //compare the password
    const isMatched = await bcrypt.compare(password, userDb.password);

    if (!isMatched) {
      return res.send({
        status: 401,
        message: "Password incorrect",
        pwExists: false,
      });
    }

    //session base auth
    console.log(req.session);
    req.session.isAuth = true;
    req.session.user = {
      email: userDb.email,
      userId: userDb._id,
    };

    return res.send({
      status: 200,
      message: "Login Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = router; // Using module.exports for exporting the router
