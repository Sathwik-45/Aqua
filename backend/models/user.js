const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    address: String,
    password: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
