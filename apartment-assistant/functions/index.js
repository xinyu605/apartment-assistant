// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");

// Setting up Nodemailer
const nodemailer = require("nodemailer");

const cors = require("cors")({ origin: true });

admin.initializeApp();

// Creating a Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bestapartmentassistant@gmail.com",
    pass: "hvdjjkqyhhznfshi", // apartment assistant gmail 驗證的金鑰(在google帳戶設定)
  },
});

// Creating a Firebase Cloud Function & Building the email message
// exports.emailSender = functions.https.onRequest((req, res) => {
//   cors(req, res, () => {
// const data = req.body; //should be recipient's name, email, subject, content
// const recipientName = data.name;
// const recipientEmail = data.email;
// const subject = data.subject;
// const content = data.content;
// console.log(data);
// const mailOptions = {
//   from: "bestapartmentassistant@gmail.com", //Adding sender's email
//   to: recipientEmail, //Getting recipient's email by query string
//   subject: subject, //Email subject
//   html: `<p>Hi! ${recipientName}</p></br><p>${content}</p>`, //Email content in HTML
// };

// return transporter.sendMail(mailOptions, (err, info) => {
//   if (err) {
//     console.log(err);
//     return res.send(err.toString());
//   }
//   return res.send("Email sent successfully");
// });
//   });
// });

//create API: https://us-central1-apartment-assistant-project.cloudfunctions.net/emailSender

// Creating a Firebase Cloud Function & Building the email message
exports.emailSender = functions.https.onCall((data, context) => {
  // cors(data, context, () => {
  const recipientName = data.name;
  const recipientEmail = data.email;
  const subject = data.subject;
  const content = data.content;
  console.log(data);
  const mailOptions = {
    from: "Apartment Assistant <bestapartmentassistant@gmail.com>", //Adding sender's email
    to: `${recipientName} <${recipientEmail}>`, //Getting recipient's email by query string
    subject: subject, //Email subject
    html: `<p>${content}</p>`, //Email content in HTML
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return { message: err.toString() };
    }
    return { message: "Email sent successfully" };
  });
  // });
});
