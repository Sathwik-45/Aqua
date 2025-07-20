// backend/server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const User = require("./models/user");

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
const ownerRoutes = require("./owner"); // Adjust path if needed
app.use("/api/owners", ownerRoutes);
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

app.get("/api/login", async (req, res) => {
  const { phone, password } = req.query;

  if (!phone || !password) {
    return res.status(400).json({ message: "Phone and password required" });
  }

  try {
    const user = await User.findOne({ phone });
    console.log("get user details",user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

const token = jwt.sign(
  { userId: user._id, name: user.name, phone: user.phone },
  SECRET_KEY,
  { expiresIn: "1h" }
);

   res.json({ 
  message: "Login successful", 
  token, 
  user: { 
    name: user.name, 
    phone: user.phone 
  } 
});


  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Example route in Express
app.get('/api/customers/:phone', async (req, res) => {
  const phone = req.params.phone;
  try {
    const customer = await User.findOne({ phone }); // Make sure `phone` is the correct field
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
