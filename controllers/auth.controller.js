const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");

async function signJWT(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

async function hashVerifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

async function createToken(user, res) {
  const token = await signJWT(user.userId);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  return token;
}

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  if (!user) {
    return next(new AppError("Failed to create user!", 400));
  }

  res.status(201).json({
    status: "Account successfully created",
    status_code: 201,
    user_id: user.userId,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }

  const exisitingUser = await User.findOne({ where: { username } });

  if (!exisitingUser) {
    return next(new AppError("No user found with given credentials!", 401));
  }

  const isPasswordCorrect = await hashVerifyPassword(
    password,
    exisitingUser.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid username or password!", 401));
  }

  const token = await createToken(exisitingUser, res);

  res.status(200).json({
    status: "Login successful",
    status_code: 200,
    user_id: exisitingUser.userId,
    access_token: token,
  });
});
