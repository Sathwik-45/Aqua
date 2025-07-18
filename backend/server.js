// backend/server.js
const express = require("express");
const cors = require("cors");

const User = require("./models/user");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.post("/api/register", async (req, res) => {
  const formData = req.body;

  try {
    const newUser = new User(formData);
    await newUser.save();

    console.log("User saved:", newUser);
    res
      .status(200)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
