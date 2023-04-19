// Import the Express module and create a new router object
const express = require("express");
const router = express.Router();

// Define routes for authentication and task management
router.use("/api/auth", require("./authRoutes"));
router.use("/api/tasks", require("./taskRoutes"));

// Export the router from the module
module.exports = router;
