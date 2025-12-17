const express = require("express");
const router = express.Router();
const Contact = require("../models/contactModel");
const sendMail = require("../utils/sendMail");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    /* ===============================
       2️⃣ EMAIL TO YOU (ADMIN)
    =============================== */
    await sendMail({
      to: process.env.EMAIL_USER,
      subject: "📩 New Contact Form Submission",
      html: `
        <div style="font-family:Arial, sans-serif;">
          <h3>📬 New Message from Portfolio</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `
    });

    /* ===============================
       3️⃣ AUTO-REPLY TO USER
       (NO MESSAGE SHOWN)
    =============================== */
    await sendMail({
      to: email,
      subject: "📬 Thank You For Reaching Out!",
      html: `
        <div style="font-family:Arial, sans-serif;padding:20px;background:#f4f4ff;border-radius:10px;">
          <h2 style="color:#4E6EF2;text-align:center;">🤝 Thanks for Contacting Me!</h2>

          <p style="font-size:16px;color:#333;">
            Hello <strong>${name}</strong> 👋,<br><br>
            Thank you for reaching out through my portfolio.
            I’ve successfully received your message.
          </p>

          <p style="font-size:16px;color:#333;">
            I’ll review it and get back to you as soon as possible ⏳.<br>
            Meanwhile, feel free to explore more of my work! 🚀
          </p>

          <p style="text-align:center;margin-top:20px;">
            <a href="https://linkedin.com/in/hariram-ramdass-464235292/"
               style="background:#4E6EF2;color:#fff;padding:10px 15px;text-decoration:none;border-radius:6px;font-size:16px;">
              🔗 Visit My linked in profile
            </a>
          </p>

          <footer style="margin-top:25px;text-align:center;color:#777;font-size:14px;">
            ❤️ Regards,<br><strong>Hariram</strong>
          </footer>
        </div>
      `
    });

    res.json({ message: "Message sent successfully! 🎉" });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
