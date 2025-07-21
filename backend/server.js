// backend/server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;
const User = require("./models/user");
const Owner = require("./models/Owners");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST","PUT","OPTIONS"],
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

const fetch = require("node-fetch"); // npm install node-fetch if not already

// Helper function to calculate distance using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.get("/api/owner/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const owner = await Owner.findById(id);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    res.json(owner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/owners", async (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLon = parseFloat(req.query.lon);

  if (!userLat || !userLon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  try {
    const owners = await Owner.find();
    const nearbyOwners = [];

    for (const owner of owners) {
      const locationText = owner.location || owner.city || owner.address;

      console.log(`\n🔍 Checking owner: ${owner.shopName}`);
      console.log(`📍 Location text: ${locationText}`);

      // Convert text location to coordinates
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationText
        )}`
      );
      const geoData = await geoRes.json();

      if (!geoData.length) {
        console.log("❌ Location not found in geocoding.");
        continue;
      }

      const ownerLat = parseFloat(geoData[0].lat);
      const ownerLon = parseFloat(geoData[0].lon);

      console.log(`🌍 Owner coordinates: lat=${ownerLat}, lon=${ownerLon}`);
      console.log(`📌 User coordinates:  lat=${userLat}, lon=${userLon}`);

      const distance = calculateDistance(userLat, userLon, ownerLat, ownerLon);
      console.log(`📏 Distance from user: ${distance.toFixed(2)} km`);

      if (distance <= 1500) {
        console.log("✅ Within 10 km - Added to result\n");
        nearbyOwners.push(owner);
      } else {
        console.log("🚫 Too far - Skipped\n");
      }
    }

    res.json(nearbyOwners);
  } catch (error) {
    console.error("❗ Error fetching owners:", error);
    res.status(500).json({ error: "Failed to fetch owners" });
  }
});

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
    console.log("get user details", user);

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
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.put('/api/users/:phone', async (req, res) => {
  try {
    const { name, phone: newPhone } = req.body;
    const { phone } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { name, phone: newPhone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

// Example route in Express
app.get("/api/customers/:phone", async (req, res) => {
  const phone = req.params.phone;
  try {
    const customer = await User.findOne({ phone }); // Make sure `phone` is the correct field
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
