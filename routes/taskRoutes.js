// Import the Express module and create a new router object
const express = require("express");
const router = express.Router();

// Import the task controller module and the authentication middleware module
const taskController = require("../controllers/taskController");
const authMiddleware = require("../config/authMiddleware");

// Define routes for creating, getting, updating, and deleting tasks
router.post("/", authMiddleware, taskController.createTask);
router.get("/getAllTasks", authMiddleware, taskController.getTasks);
router.get("/filterTask", authMiddleware, taskController.filterTask);
router.put("/:taskId", authMiddleware, taskController.updateTask);
router.delete("/:taskId", authMiddleware, taskController.deleteTask);

// Export the router from the module
module.exports = router;
