const validator = require("validator");

const cleanupAndValidate = ({ name, phone,email,password,company }) => {
  return new Promise((resolve, reject) => {
    if (!name || !email || !phone || !password ||!company)
      reject("Missing credentials");

    if (typeof name !== "string") reject("Datatype of name is wrong");
    if (typeof email !== "string") reject("Datatype of email is wrong");
    if (typeof password !== "string") reject("Datatype of password is wrong");
    if (typeof company !== "string") reject("Datatype of password is wrong");

    if (password.length <= 2 || password.length > 30)
      reject("password length should be 3-30");

    if (!validator.isEmail(email)) {
      reject("Email format is wrong");
    }

    resolve();
  });
};

module.exports = { cleanupAndValidate };
