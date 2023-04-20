// Import required modules
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

// Create a nodemailer transporter object with the Gmail service
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // Get Gmail email and password from environment variables
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
});

// Export the transporter object for use in other modules
module.exports = { transporter };
