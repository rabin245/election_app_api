const nodemailer = require("nodemailer");
require("dotenv").config();

const MAIL_SETTINGS = {
  service: "outlook",
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMail = async ({ to, otp }) => {
  const mailOptions = {
    from: "Election Dapp Team <" + process.env.MAIL_EMAIL + ">",
    to: to,
    subject: "Single-use code for Election Dapp",
    html: `
      <p>Hi ${to},</p>
      <p>Here is your single-use code for Election Dapp: <b>${otp}</b></p>
      <p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
      <p>Thanks,</p>
      <p>Election Dapp Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
