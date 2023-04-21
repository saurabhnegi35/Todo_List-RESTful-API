// Import the Mongoose module
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  // Add a timestamp field to the schema
  {
    timestamps: true,
  }
);

// Define a pre-save middleware function for the user schema
userSchema.pre("save", async function (next) {
  const user = this; // Get a reference to the current user document

  // Check if the password field has been modified
  if (!user.isModified("password")) {
    return next(); // If not, move on to the next middleware function or save the document
  }

  // If the password has been modified, generate a salt and hash the password
  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds of hashing
  const hash = await bcrypt.hash(user.password, salt); // Hash the user's password with the salt

  user.password = hash; // Set the hashed password as the value for the password field in the user document
  next(); // Move on to the next middleware function or save the document
});

// Define an instance method for the user schema to compare a candidate password with the hashed password stored in the document
userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this; // Get a reference to the current user document

  // Compare the candidate password with the hashed password stored in the document using bcrypt
  return bcrypt.compare(candidatePassword, user.password);
};

// Create a new Mongoose model for a user using the user schema
const User = mongoose.model("User", userSchema);

// Export the user model from the module
module.exports = User;
