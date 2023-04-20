// Importing nodemailer module and our custom transporter object
const nodeMailer = require("../mailer/nodemailer");

// Defining a function to send the email with the given parameters
exports.taskMail = (userName, user) => {
  // Using our transporter object to send the email
  nodeMailer.transporter.sendMail(
    {
      from: "reachsaurabhnegi@gmail.com", // Sender email address
      to: user, // Receivers email address
      subject: `Task Deleted Successfully`, // Email subject

      // Email body, using HTML and string interpolation to insert dynamic values
      html: `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Your Email Subject Line</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            background-color: #fff;
            margin: 0;
            padding: 0;
          }
      
          table {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border-collapse: collapse;
          }
      
          td {
            padding: 10px;
            border: 1px solid #ccc;
            text-align: left;
            vertical-align: top;
          }
      
          img {
            max-width: 100%;
            height: auto;
            display: block;
            border: 0;
            margin: 0 auto;
          }
      
          a {
            color: #0078e7;
            text-decoration: none;
          }
          .pass{
            font-size: 20px;
          }
      
          h1 {
            font-size: 24px;
            margin: 20px 0;
            text-align: center;
          }
      
          p {
            margin: 10px 0;
            text-align: justify;
          }
        </style>
      </head>
      <body>
        <table>
          <!-- <tr> 
            <td>
              <img src="https://yourcompany.com/images/logo.png" alt="Your Company Logo">
            </td>
          </tr>  -->
          <tr>
            <td>
              <h1>Hi, ${userName} your task has been Deleted</h1>
              
            </td>
          </tr>
          <tr>
            <td>
              <p>Regards,</p>
              <p>Saurabh </p>
            </td>
          </tr>
        </table>
      </body>
      </html>`,
    },
    // Callback function to handle response
    (err, info) => {
      if (err) {
        console.log("error in sending mail", err); // Log error if there is any
      }
      console.log("mail sent", info); // Log info object if email is sent successfully
      return;
    }
  );
};
