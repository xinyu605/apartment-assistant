let express = require("express");
let app = express();
const hbs = require("nodemailer-express-handlebars");
const router = express.Router();
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(req, res) {
  let data = req.body; //should be customerName, email

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "gmail",
    auth: {
      user: "bestapartmentassistant@gmail.com",
      pass: "apartment123",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Apartment Assistant" <bestapartmentassistant@gmail.com>', // sender address
    to: `${data.name} <${data.email}>`, // list of receivers
    subject: `${data.name}, 你有一則新的信件包裹通知`, // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendEmail().catch(console.error);

//serve PORT running here
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
