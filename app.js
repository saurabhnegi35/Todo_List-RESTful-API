// Import the Express module
const express = require("express");

// Import the Mongoose connection object from a separate module
const db = require("./config/mongoose");

// Create an Express application
const app = express();

// Set up middleware to parse request bodies with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Export the Express application from the module
module.exports = app;
