const { matchedData, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const {
  userRegisterValidator,
  userLoginValidator,
} = require("../validators/auth.validator");
const User = require("../models/User");
const AppError = require("../utils/appError");

exports.register = catchAsync(async (req, res, next) => {
  await Promise.all(
    userRegisterValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const data = matchedData(req);
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    return next(new AppError("Email is already in use", 400));
  }

  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    role: data.role || "user",
  });

  newUser.password = undefined;
  newUser.passwordConfirm = undefined;

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
      token,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  await Promise.all(userLoginValidator.map((validator) => validator.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { email, password } = matchedData(req);
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid email or password.", 401));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError("Invalid email or password.", 401));
  }
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(200).json({
    message: "Login successful.",
    token,
  });
});
