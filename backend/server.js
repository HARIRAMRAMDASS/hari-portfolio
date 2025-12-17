const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/contact", contactRoutes);

/* ======================
   DATABASE & SERVER
====================== */
mongoose.set("strictQuery", true);

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
};

startServer();
