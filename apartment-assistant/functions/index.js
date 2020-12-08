// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");

// Setting up Nodemailer
const nodemailer = require("nodemailer");

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Creating a Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bestapartmentassistant@gmail.com",
    pass: "hvdjjkqyhhznfshi", // apartment assistant gmail 驗證的金鑰(在google帳戶設定)
  },
});

// Creating a Firebase Cloud Function & Building the email message
exports.emailSender = functions.https.onRequest((req, res) => {
  const mailOptions = {
    from: "bestapartmentassistant@gmail.com", //Adding sender's email
    to: "xinyuyan605@gmail.com", //Getting recipient's email by query string
    subject: "Email Sent via Firebase", //Email subject
    html: '<p style="color:red">Sending emails with Firebase is easy!</p>', //Email content in HTML
  };

  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.send(err.toString());
    }
    return res.send("Email sent successfully");
  });
});

//API: https://us-central1-apartment-assistant-project.cloudfunctions.net/emailSender
