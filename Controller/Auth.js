const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// helper to generate JWT
const generateToken = (user) => {
  const payload = {
    email: user.email,
    id: user._id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // generate token for newly registered user
    const token = generateToken(user);

    // convert to plain object and hide password
    user = user.toObject();
    user.password = undefined;
    user.token = token; // ✅ token inside user

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    return res
      .cookie("token", token, options)
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        token,    // ✅ top-level token
        user,     // ✅ user object with token field
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all details",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(403).json({
        success: false,
        message: "Password incorrect",
      });
    }

    const token = generateToken(user);

    // convert to plain JS object and clean up
    user = user.toObject();
    user.password = undefined;
    user.token = token; // ✅ token inside user

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        message: "User logged in",
        token,    // ✅ top-level token
        user,     // ✅ user object with token field
      });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in login",
    });
  }
};
