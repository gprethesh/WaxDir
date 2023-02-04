const express = require("express");

const connectDB = require("./config/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const morgan = require("morgan");

const cors = require("cors");

// connect database
connectDB();

const app = express();

app.use(cors());
app.options("*", cors());

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// serve the react app files
app.use(express.static(`${__dirname}/build`));

const homeRouter = require("./route/home");

app.use("/api", homeRouter);

module.exports = app;
