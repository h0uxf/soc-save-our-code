const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/authModel");
const pool = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const SALT_ROUNDS = 10;
const validationResult = require("express-validator");

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { username, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await createUser(username, email, hashedPassword);
    // console.log("Hashed password: ", hashedPassword);

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // console.log(user);
    // console.log('password from body:', password);
    // console.log('password hash from db:', user.passwordHash);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.user_id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const expiresAt = new Date(Date.now() + 3600 * 1000);

    // inserts into the database
    await pool.query(
      "INSERT INTO login_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.user_id, token, expiresAt]
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function logout(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // remove session from DB
    await pool.query("DELETE FROM login_sessions WHERE token = $1", [token]);

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  register,
  login,
  logout,
};
