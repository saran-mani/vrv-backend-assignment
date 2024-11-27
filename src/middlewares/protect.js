const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { verifyToken } = require("../utils/jwtTokenHelper");

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not Logged in", 401));
  }

  const decoded = verifyToken(token);

  const currentUser = await User.findOne(
    { _id: decoded.id, isActive: true },
    { _id: 1, role: 1 }
  );

  if (!currentUser) {
    return next(new AppError("Token not exists", 401));
  }

  req.user = currentUser;

  next();
});
