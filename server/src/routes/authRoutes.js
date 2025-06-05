const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { body } = require('express-validator');

router.post("/register", [
  body('username').isLength({ min: 3, max: 20 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], authController.register);

router.post("/login", authController.login);
router.post('/logout', authController.logout);

module.exports = router;
