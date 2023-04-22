// Import the Task and User Model
const Task = require("../models/Task");
const User = require("../models/User");

// Import taskCreateMailer, taskUpdateMailer and taskDeleteMailer
const taskCreateMailer = require("../mailer/taskCreatedMail");
const taskUpdateMailer = require("../mailer/taskUpdateMail");
const taskDeleteMailer = require("../mailer/taskDeleteMail");

// Controller function to create a new task
exports.createTask = async (req, res) => {
  // Extract name and description from the request body
  const { name, description, dueDate } = req.body;
  // Extract user ID from the authenticated user object in the request
  const userId = req.user._id;
  console.log(userId);

  try {
    // Find the user with the given userId and get their email
    const user = await User.findById(userId);
    const email = user.email;
    const userName = user.name;
    console.log(email);

    // Create a new task in the database with the extracted fields
    const task = await Task.create({
      name,
      description,
      dueDate,
      user: userId,
    });
    const status = task.status;

    // Send email to user about newly created task
    taskCreateMailer.taskMail(
      email,
      name,
      description,
      userName,
      status,
      dueDate
    );

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
  const userId = req.user._id;
  // Extract the sort, select, page, limit query parameter from the request
  const { sort, select, page, limit } = req.query;
  // Construct a query object to filter tasks by user
  const query = { user: userId };

  try {
    let apiData = Task.find(query);

    // If the Sort Query is present then sort the Data accordingly
    if (sort) {
      let sortFix = sort.split(",").join(" ");
      apiData = apiData.sort(sortFix);
    }

    // If the Select Query is present then Select the Data accordingly
    if (select) {
      let selectFix = select.split(",").join(" ");
      apiData = apiData.select(selectFix);
    }

    // Converting the String input into Number
    let pageNumber = Number(page) || 1;
    let pageLimit = Number(limit) || 3;

    // Formula For Pagination
    let skip = (pageNumber - 1) * pageLimit;
    // Applying Pagination on Data
    apiData = apiData.skip(skip).limit(pageLimit);

    // Find tasks in the database that match the constructed query
    const tasks = await apiData;
    // const name = tasks.name

    // Return the found tasks in the response with a 200 status code
    return res.status(200).json(tasks);
  } catch (err) {
    // Log any errors and return a 500 error to the client
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function to get a list of filtered tasks
exports.filterTask = async (req, res) => {
  // Extract user ID from the authenticated user object in the request
  const userId = req.user._id;
  // Extract the name, status, sort, select, page and limit query parameter from the request
  const { name, status, sort, select, page, limit } = req.query;

  // Construct a query object to filter tasks by user and status
  const query = { user: userId };

  // Add "name" and "status" fields to the query object if they exist
  if (name) {
    query.name = { $regex: name, $options: "i" };
  }
  if (status) {
    query.status = status;
  }

  try {
    let apiData = Task.find(query);

    // If the Sort Query is present then sort the Data accordingly
    if (sort) {
      let sortFix = sort.split(",").join(" ");
      apiData = apiData.sort(sortFix);
    }

    // If the Select Query is present then Select the Data accordingly
    if (select) {
      let selectFix = select.split(",").join(" ");
      apiData = apiData.select(selectFix);
    }

    // Converting the String input into Number
    let pageNumber = Number(page) || 1;
    let pageLimit = Number(limit) || 3;

    // Formula For Pagination
    let skip = (pageNumber - 1) * pageLimit;
    // Applying Pagination on Data
    apiData = apiData.skip(skip).limit(pageLimit);

    // Find tasks in the database that match the constructed query
    const tasks = await apiData;

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
  const { name, description, status, dueDate } = req.body;
  // Extract the task ID from the request parameters
  const { taskId } = req.params;
  // Extract user ID from the authenticated user object in the request
  const userId = req.user._id;

  try {
    // Find the user with the given userId and get their email
    const user = await User.findById(userId);
    const email = user.email;
    const userName = user.name;

    console.log(email);

    // Find a task in the database with the extracted task ID and user ID,
    // and update its name, description, and status with the extracted values
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { name, description, status, dueDate },
      { new: true }
    );
    const taskName = task.name;
    const taskDueDate = task.dueDate;
    const taskDescription = task.description;

    // If no matching task was found, return a 404 error to the client
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Send email to user about newly created task
    taskUpdateMailer.taskMail(
      email,
      "Updated",
      taskName,
      taskDescription,
      userName,
      status,
      taskDueDate
    );

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
  const userId = req.user._id;

  try {
    // Find the user with the given userId and get their email
    const user = await User.findById(userId);
    const email = user.email;
    const userName = user.name;
    console.log(email);

    const taskItem = await Task.findById(taskId);
    const taskName = taskItem.name;
    const taskDescription = taskItem.description;

    // Find the task to delete and ensure that it belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Send email to user about newly created task
    taskDeleteMailer.taskMail(userName, email, taskName, taskDescription);
    // Return a 200 response with a success message if the task was successfully deleted
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    // Log any errors that occur and return a 500 response with a generic error message
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
