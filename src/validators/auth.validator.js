const { body } = require("express-validator");

const userRegisterValidator = [
  body("name").notEmpty().withMessage("Please provide a name.").trim(),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password.");
    }
    return true;
  }),
];

const userLoginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Please provide a password."),
];

module.exports = { userRegisterValidator, userLoginValidator };
