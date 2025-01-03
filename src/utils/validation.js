const validator = require("validator");
const validateSignup = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("firstname or lastname is missing");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("firstname is not valid.length must be 4 to 49");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};
const isUpdateValid = (req) => {
  const allowedFields = ["firstName", "lastName", "email", "age", "gender"];
  const valid = Object.keys(req.body).every((feild) =>
    allowedFields.includes(feild)
  );
  if (!valid) {
    throw new Error("Invalid update request");
  }
};
module.exports = { validateSignup, isUpdateValid };
