// Example: routes/owners.js (Node.js/Express)
const express = require("express");
const router = express.Router();
const Owner = require("./models/Owners"); // Mongoose model

router.get("/", async (req, res) => {
  try {
    const owners = await Owner.find();
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch owners" });
  }
});

module.exports = router;
