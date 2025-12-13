const express = require("express");
const router = express.Router();
const Contact = require("../models/contactModel");
const sendMail = require("../utils/sendMail"); // Import mail function

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEntry = new Contact({
      name,
      email,
      message,
    });

    await newEntry.save();

    // ✉️ Automated Attractive Email to User
    await sendMail(
      email,
      "📬 Thank You For Reaching Out!",
      `
      <div style="font-family:Arial, sans-serif;padding:20px;background:#f4f4ff;border-radius:10px;">
        <h2 style="color:#4E6EF2;text-align:center;">🤝 Thanks for Contacting Me!</h2>

        <p style="font-size:16px;color:#333;">
        Hello <strong>${name}</strong> 👋,<br><br>
        Thank you for your message! I truly appreciate your time and effort in reaching out.
        </p>

        <div style="padding:15px;background:white;border-left:4px solid #4E6EF2;border-radius:6px; margin:10px 0;">
          <p style="font-size:15px;color:#555;">📝 <strong>Your Message:</strong><br>
          "${message}"
          </p>
        </div>

        <p style="font-size:16px;color:#333;">
        I will get back to you as soon as possible ⏳.<br>
        Meanwhile, feel free to explore more of my work! 🚀
        </p>

        <p style="text-align:center;margin-top:20px;">
          <a href="https://your-portfolio-link.com" 
             style="background:#4E6EF2;color:#fff;padding:10px 15px;text-decoration:none;border-radius:6px;font-size:16px;">
            🔗 Visit My Portfolio
          </a>
        </p>

        <footer style="margin-top:25px;text-align:center;color:#777;font-size:14px;">
          ❤️ Regards,<br><strong>Hari’s Portfolio</strong>
        </footer>
      </div>
      `
    );

    res.json({ message: "Message sent successfully! 🎉 Email delivered 📩" });

  } catch (err) {
    console.error("Contact Error:", err);
    res.status(500).json({
      message: "Error saving your message or sending email",
      error: err,
    });
  }
});

module.exports = router;
