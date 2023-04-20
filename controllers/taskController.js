// Import the Task model
const Task = require("../models/Task");

// Controller function to create a new task
exports.createTask = async (req, res) => {
  // Extract name and description from the request body
  const { name, description } = req.body;
  // Extract user ID from the authenticated user object in the request
  const { userId } = req.user;

  try {
    // Create a new task in the database with the extracted fields
    const task = await Task.create({ name, description, user: userId });

    // Return the created task in the response with a 201 status code
    return res.status(201).json(task);
  } catch (err) {
    // Log any errors and return a 500 error to the client
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Controller function to get a list of tasks
exports.getTasks = async (req, res) => {
  // Extract user ID from the authenticated user object in the request
  const { userId } = req.user;
  // Extract the optional "status" query parameter from the request
  const { status } = req.query;

  // Construct a query object to filter tasks by user and status
  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  try {
    // Find tasks in the database that match the constructed query
    const tasks = await Task.find(query);

    // Return the found tasks in the response with a 200 status code
    return res.status(200).json(tasks);
  } catch (err) {
    // Log any errors and return a 500 error to the client
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function to update an existing task
exports.updateTask = async (req, res) => {
  // Extract name, description, and status from the request body
  const { name, description, status } = req.body;
  // Extract the task ID from the request parameters
  const { taskId } = req.params;
  // Extract user ID from the authenticated user object in the request
  const { userId } = req.user;

  try {
    // Find a task in the database with the extracted task ID and user ID,
    // and update its name, description, and status with the extracted values
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { name, description, status },
      { new: true }
    );

    // If no matching task was found, return a 404 error to the client
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Return the updated task in the response with a 200 status code
    return res.status(200).json(task);
  } catch (err) {
    // Log any errors and return a 500 error to the client
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function to delete an existing task
exports.deleteTask = async (req, res) => {
  // Extract the task ID from the request parameters
  const { taskId } = req.params;
  // Extract user ID from the authenticated user object in the request
  const { userId } = req.user;

  try {
    // Find the task to delete and ensure that it belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    // If no task was found, return a 404 response
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Return a 200 response with a success message if the task was successfully deleted
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    // Log any errors that occur and return a 500 response with a generic error message
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
