// Import the Express application from a separate module
const app = require("./app");

// Set the port number for the server to listen on
const PORT = 7000;

// Start the server and listen on the specified port number
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
