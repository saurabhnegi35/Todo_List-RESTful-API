// Import the Express module
const express = require("express");
// Import the Mongoose connection object from a separate module
const db = require("./config/mongoose");
// Import the application routes from a separate module
const routes = require("./routes/index");

// Create an Express application
const app = express();

// Set up middleware to parse request bodies with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Mount the application routes at the root path
app.use("/", routes);

// Export the Express application from the module
module.exports = app;
