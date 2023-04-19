const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

mongoose.connect("mongodb://localhost/Todo_List_API", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind("error", "console"));

db.once("open", function () {
  console.log("Connected to Database :: MongoDB");
});
module.exports = db;
