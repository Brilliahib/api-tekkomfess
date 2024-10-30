const { auth } = require("../utils/firebase");
const jwt = require("jsonwebtoken");
const { getFirestore, doc, setDoc, getDoc } = require("firebase/firestore");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid"); // Import UUID

// Load variables from .env file
require("dotenv").config({ path: ".env.local" });

const JWT_SECRET = process.env.JWT_SECRET || "CHANGETHISPLEASE";
const db = getFirestore();

// Register User
const register = async (req, res) => {
  const { email, password, fullname } = req.body;

  if (!email || !password || !fullname) {
    return res.status(400).json({
      statusCode: 400,
      message: "Email, password, fullname are required.",
    });
  }

  try {
    // Check email if already
    const userQuery = await getDoc(doc(db, "users", email));
    if (userQuery.exists()) {
      return res.status(400).json({
        statusCode: 400,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random UID
    const uid = uuidv4();

    await setDoc(doc(db, "users", email), {
      uid,
      email,
      fullname,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({
      statusCode: 201,
      message: "User registered successfully",
      data: {
        uid,
        fullname,
        email,
      },
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: "Error creating user",
      error: error.message,
    });
  }
};

// Login users
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: "Email and password are required.",
    });
  }

  try {
    const userQuery = await getDoc(doc(db, "users", email));
    if (!userQuery.exists()) {
      return res.status(401).json({
        statusCode: 401,
        message: "User not found",
      });
    }

    const userData = userQuery.data();
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { uid: userData.uid, email: userData.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      statusCode: 200,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.status(401).json({
      statusCode: 401,
      message: "Login failed",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({
      statusCode: 400,
      message: "Email, old password, and new password are required.",
    });
  }

  try {
    const userQuery = await getDoc(doc(db, "users", email));
    if (!userQuery.exists()) {
      return res.status(401).json({
        statusCode: 401,
        message: "User not found",
      });
    }

    const userData = userQuery.data();
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      userData.password
    );

    if (!isOldPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        message: "Old password is invalid",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await setDoc(doc(db, "users", email), {
      ...userData,
      password: hashedNewPassword,
    });

    res.status(200).json({
      statusCode: 200,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: "Error changing password",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  changePassword,
};
