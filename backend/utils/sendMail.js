const nodemailer = require("nodemailer");

const sendMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);

  } catch (error) {
    console.error("Mail Error:", error);
  }
};

module.exports = sendMail;
