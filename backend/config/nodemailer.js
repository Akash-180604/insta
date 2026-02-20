const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587 ,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_FOR_OTP,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Send an email using async/await
const sendEmail = async (email,otp)=>{
  try {
    const mailerRes = await transporter.sendMail({
    from: '"Maddison Foo Koch " <maddison53@ethereal.email>',
    to: email,
    subject: "Reset your Password",
    html: `<p> Your OTP for Password reset is <u><b> ${otp}</b></u> <br/>
            It expires in 90 second </p>`, // HTML version of the message
  });
  return mailerRes
  } catch (error) {
  console.log('sendEmail Error',error);
  }
}

module.exports = sendEmail;