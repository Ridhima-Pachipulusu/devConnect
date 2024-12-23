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
module.exports = { validateSignup };
