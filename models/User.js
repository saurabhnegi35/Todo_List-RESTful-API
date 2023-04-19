// Import the Mongoose module
const mongoose = require("mongoose");

// Define a new Mongoose schema for a user
const userSchema = new mongoose.Schema(
  {
    // Define a field for the user's email address
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Define a field for the user's password
    password: {
      type: String,
      required: true,
    },
    // Define a field for the user's name
    name: {
      type: String,
      required: true,
    },
  },
  // Add a timestamp field to the schema
  {
    timestamps: true,
  }
);

// Create a new Mongoose model for a user using the user schema
const User = mongoose.model("User", userSchema);

// Export the user model from the module
module.exports = User;
