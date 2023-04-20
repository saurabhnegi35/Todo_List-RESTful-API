// Importing the User model
const User = require("../models/User");
// Importing the JWT library
const jwt = require("jsonwebtoken");
// Secret key for JWT authentication
const JWT_SECRET = "idontknow";

exports.register = async (req, res) => {
  // Extracting name, email, and password from the request body
  const { name, email, password } = req.body;
  // Creating a new User object with the extracted data
  const user = new User({ name, email, password });

  try {
    // Saving the new user to the database
    const newUser = await user.save();
    // Sending a success response with the newly created user object
    res.status(201).json(newUser);
  } catch (err) {
    // Sending an error response if there is a problem with creating the user
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  // Extracting email and password from the request body
  const { email, password } = req.body;

  try {
    // Finding the user with the given email
    const user = await User.findOne({ email });
    // Checking if the user exists and the password is correct
    if (!user || user.password != password) {
      // Sending an error response if the credentials are invalid
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // const isMatch = await user.checkPassword(password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    // Creating a new JWT token with the user's ID and the secret key
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      // Sending a success response with a message
      message: "Looged In Successfully",
      // Sending the token as data
      data: token,
    });

    // res.json({ token });
  } catch (err) {
    // Sending an error response if there is a problem with finding the user
    res.status(500).json({ message: err.message });
  }
};
