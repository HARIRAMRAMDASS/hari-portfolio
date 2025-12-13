const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Register routes BEFORE starting the server
app.use("/api/contact", contactRoutes);
app.use("/api/gemini", geminiRoutes);
mongoose.set("strictQuery", true);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }

  app.listen(5000, () => {
    console.log("Backend Server running on http://localhost:5000");
  });
};

startServer();
