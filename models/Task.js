// Import the Mongoose module
const mongoose = require("mongoose");

// Define a schema for a "task" object
const taskSchema = new mongoose.Schema(
  {
    // Name of the task (required field)
    name: {
      type: String,
      required: true,
    },
    // Description of the task (required field)
    description: {
      type: String,
      required: true,
    },
    // Status of the task (either "pending" or "completed"; defaults to "pending")
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    dueDate: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Add timestamp fields to the schema
    timestamps: true,
  }
);

// Create a Mongoose model for the "Task" object using the schema
const Task = mongoose.model("Task", taskSchema);

// Export the "Task" model from the module
module.exports = Task;
