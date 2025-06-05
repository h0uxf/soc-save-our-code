const express = require("express");
const createHttpError = require('http-errors');
const app = express();
const cors = require("cors");
const pool = require("./config/db.js");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// routes 
const mainRoutes = require("./routes/mainRoutes.js");
app.use("/", mainRoutes);

// error handling for http 404 (resource not found)
app.use(function (req, res, next) {
    return next(createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    return res.status(err.status || 500).json({ error: err.message || 'Unknown Server Error!' });
});

module.exports = app;
