const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  ownerName: String,
  phone: String,
  email: String,
  location: String, // Could be address, city, or area name
  city: String,
  address: String,
});

module.exports = mongoose.model("Owner", ownerSchema);
