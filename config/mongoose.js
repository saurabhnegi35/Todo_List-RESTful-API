// Import the Mongoose module
const mongoose = require("mongoose");

// Set the "strictQuery" option to true for Mongoose
mongoose.set("strictQuery", true);

// Connect to a MongoDB database named "Todo_List_API"
mongoose.connect("mongodb://localhost/Todo_List_API", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection for Mongoose
const db = mongoose.connection;

// Log an error message if there's an error connecting to the database
db.on("error", console.error.bind("error", "console"));

// Log a success message if the connection is successful
db.once("open", function () {
  console.log("Connected to Database :: MongoDB");
});

// Export the database connection object from the module
module.exports = db;
