// Import the Express module and create a new router object
const express = require("express");
const router = express.Router();

// Import the task controller, admin task controller module and the authentication middleware module
const taskController = require("../controllers/taskController");
const adminTaskController = require("../controllers/adminTaskController");
const { authMiddleware, adminMiddleware } = require("../config/authMiddleware");

// Define routes for creating, getting, filtering, updating, and deleting tasks
router.post("/", authMiddleware, taskController.createTask);
router.get("/getAllTasks", authMiddleware, taskController.getTasks);
router.get("/filterTask", authMiddleware, taskController.filterTask);
router.put("/:taskId", authMiddleware, taskController.updateTask);
router.delete("/:taskId", authMiddleware, taskController.deleteTask);

// Define routes for assigning tasks to users and getting user and task data by Admin
router.post(
  "/assignExistingTask",
  authMiddleware,
  adminMiddleware,
  adminTaskController.assignExistingTask
);
router.post(
  "/assignNewTask",
  authMiddleware,
  adminMiddleware,
  adminTaskController.assignNewTask
);

router.get(
  "/getAllUsers",
  authMiddleware,
  adminMiddleware,
  adminTaskController.getAllUsers
);

router.get(
  "/getTask/:userId",
  authMiddleware,
  adminMiddleware,
  adminTaskController.getTaskById
);

// Export the router from the module
module.exports = router;
