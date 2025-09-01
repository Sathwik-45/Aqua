const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;
const User = require("./models/user");
const Owner = require("./models/Owners");
const Order = require("./models/order");

const app = express();
const PORT = process.env.PORT || 5000;

// Updated CORS configuration to allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://aqua-umber.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
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

const fetch = require("node-fetch");

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

app.get("/geocode", async (req, res) => {
  const { q } = req.query;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${q}`,
      {
        headers: {
          "User-Agent": "your-app-name", // Nominatim requires UA
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

app.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "my-app/1.0 (your_email@example.com)", // Required by Nominatim
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

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

      // ✅ Nested try-catch to handle individual geocoding failures
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationText
          )}`,
          {
            headers: {
              "User-Agent": "my-app/1.0 (your_email@example.com)",
            },
          }
        );

        if (!geoRes.ok) {
          console.log(`Nominatim API responded with status: ${geoRes.status}`);
          continue;
        }
        
        const geoData = await geoRes.json();

        if (!geoData.length) {
          console.log("❌ Location not found in geocoding.");
          continue;
        }

        const ownerLat = parseFloat(geoData[0].lat);
        const ownerLon = parseFloat(geoData[0].lon);

        console.log(`🌍 Owner coordinates: lat=${ownerLat}, lon=${ownerLon}`);
        console.log(`📌 User coordinates:  lat=${userLat}, lon=${userLon}`);

        const distance = calculateDistance(userLat, userLon, ownerLat, ownerLon);
        console.log(`📏 Distance from user: ${distance.toFixed(2)} km`);

        if (distance <= 10) { 
          console.log("✅ Within 10 km - Added to result\n");
          nearbyOwners.push(owner);
        } else {
          console.log("🚫 Too far - Skipped\n");
        }
      } catch (geocodingError) {
        console.error(`❗ Error geocoding location for owner ${owner.shopName}:`, geocodingError);
        continue;
      }
    }

    res.json(nearbyOwners);
  } catch (error) {
    console.error("❗ Error fetching owners:", error);
    res.status(500).json({ error: "Failed to fetch owners" });
  }
});

app.post("/api/user/update-delivery-address", async (req, res) => {
  const { phone, delivery_address } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { phone },
      { delivery_address },
      { new: true }
    );

    console.log("User", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Address updated", delivery_address });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/get-delivery-address", async (req, res) => {
  const { phone } = req.query;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Deliveraddress", user.delivery_address);
    return res.json({ delivery_address: user.delivery_address || "" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.post("/api/orders/create", async (req, res) => {
  try {
    const {
      shopPhone,
      shopName,
      shopOwner,
      shopAddress,
      customerName,
      phoneNumber,
      userAddress,
      paymentMethod,
      paymentStatus,
      paymentId,
      orderItems,
      amount,
    } = req.body;

    const newOrder = new Order({
      shopPhone,
      shopName,
      shopOwner,
      shopAddress,
      customerName,
      phoneNumber,
      userAddress,
      paymentMethod,
      paymentStatus,
      paymentId,
      orderItems,
      amount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, phone, email, address, password, confirmPassword } = req.body;

  try {
    // 1️⃣ Required fields
    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Indian phone validation (10 digits, starts 6–9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid Indian phone number" });
    }

    // 3️⃣ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 4️⃣ Password validation rules
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 5️⃣ Duplicate check
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or phone number already registered" });
    }

    // 6️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7️⃣ Save user
    const newUser = new User({
      name,
      phone,
      email,
      address,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("User saved:", newUser);

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  console.log("entered login route");
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Phone and password required" });
  }

  try {
    const user = await User.findOne({ phone });
    console.log("User found:", user);
    console.log("hased password", user.password);
    console.log("password", password);

    const test = await bcrypt.hash("Saikrishna@1789", 10);
    console.log("testing", test);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Compare plain password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate token
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

app.get("/api/orders", async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const orders = await Order.find({ phoneNumber: phone });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/users/:phone", async (req, res) => {
  try {
    const { name, phone: newPhone } = req.body;
    const { phone } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { name, phone: newPhone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
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
