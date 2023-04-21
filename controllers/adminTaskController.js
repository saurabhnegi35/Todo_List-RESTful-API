// Import the Task and User models, and the taskCreatedMail mailer
const Task = require("../models/Task");
const User = require("../models/User");
const taskCreateMailer = require("../mailer/taskCreatedMail");

// Controller function to assign an existing task to a user
exports.assignExistingTask = async (req, res) => {
  try {
    // Extract taskId and userId from the request body
    const { taskId, userId } = req.body;

    // Check if both taskId and userId are provided
    if (!taskId || !userId) {
      return res
        .status(400)
        .json({ message: "Please provide taskId and userId" });
    }

    // Find the user with the given userId and get their email
    const user = await User.findById(userId);
    const email = user.email;
    const userName = user.name;
    console.log(email);

    // Find the task with the given taskId
    const task = await Task.findById(taskId);

    // Check if the task exists
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task with the assigned user ID
    task.user = userId;
    await task.save();

    //Find the taskName, description, dueDate and Status from Task Model
    const name = task.name;
    const description = task.description;
    const status = task.status;
    const dueDate = task.dueDate;

    // Send an email to the assigned user about the newly assigned task
    taskCreateMailer.taskMail(
      email,
      name,
      description,
      userName,
      status,
      dueDate
    );

    // Return a success message to the client
    return res.status(200).json({ message: "Task assigned successfully" });
  } catch (err) {
    // Log any errors and return a 500 error to the client
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function to assign a new task to a user
exports.assignNewTask = async (req, res) => {
  try {
    // Extract userId, name, description, and dueDate from the request body
    const { userId, name, description, dueDate } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "Please provide UserId" });
    }

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

    // Send an email to the assigned user about the newly created task
    taskCreateMailer.taskMail(
      email,
      name,
      description,
      userName,
      status,
      dueDate
    );
    // Return a success message to the client
    return res.status(200).json({ message: "Task assigned successfully" });
  } catch (err) {
    // Log any errors and return a 500 error to the client
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function to get a list of tasks
exports.getAllUsers = async (req, res) => {
  // Extract the sort, select, page, limit query parameter from the request
  const { sort, select, page, limit } = req.query;

  // Log a message to indicate the function is called
  console.log(sort, select, page, limit);

  // Construct a query to find all users in the database
  let apiData = User.find({}).select("-password");

  // If the Sort Query is present then sort the Data accordingly
  if (sort) {
    // Split the comma separated query string and join by space to fix the format for mongoose sort
    let sortFix = sort.split(",").join(" ");
    console.log(`${sortFix}`);
    // Apply the sort query to the apiData
    apiData = apiData.sort(sortFix);
  }

  // Converting the String input into Number for pagination
  let pageNumber = Number(page) || 1;
  let pageLimit = Number(limit) || 2;

  // Formula for pagination
  let skip = (pageNumber - 1) * pageLimit;

  // Applying pagination on data
  apiData = apiData.skip(skip).limit(pageLimit);

  try {
    // Execute the query to find all users
    const users = await apiData;

    // Return the found users in the response with a 200 status code
    return res.status(200).json(users);
  } catch (err) {
    // Log any errors and return a 500 error to the client
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function to get a list of tasks by userId
exports.getTaskById = async (req, res) => {
  // Extract userId from the request parameters
  const { userId } = req.params;

  // Extract the sort, select, page, limit query parameter from the request
  const { sort, select, page, limit } = req.query;

  // Construct a query object to filter tasks by user
  let apiData = Task.find({ userId });

  // If the Sort Query is present then sort the Data accordingly
  if (sort) {
    // Split the comma separated query string and join by space to fix the format for mongoose sort
    let sortFix = sort.split(",").join(" ");
    // Apply the sort query to the apiData
    apiData = apiData.sort(sortFix);
  }

  // If the Select Query is present then Select the Data accordingly
  if (select) {
    // Split the comma separated query string and join by space to fix the format for mongoose select
    let selectFix = select.split(",").join(" ");
    // Apply the select query to the apiData
    apiData = apiData.select(selectFix);
  }

  // Converting the String input into Number for pagination
  let pageNumber = Number(page) || 1;
  let pageLimit = Number(limit) || 2;

  // Formula For Pagination
  let skip = (pageNumber - 1) * pageLimit;
  // Applying Pagination on Data
  apiData = apiData.skip(skip).limit(pageLimit);

  try {
    // Execute the query to find tasks for the specified user
    const tasks = await apiData;

    // Return the found tasks in the response with a 200 status code
    return res.status(200).json(tasks);
  } catch (err) {
    // Log any errors and return a 500 error to the client
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
