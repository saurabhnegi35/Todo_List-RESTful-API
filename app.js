const express = require("express");
const db = require("./config/mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));

module.exports = app;
