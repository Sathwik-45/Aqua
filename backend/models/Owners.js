const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  shopName: String,
  shopPhoto: String,
  description: String,
  ownerName: String,
  address: String,
  location: {
    city: String,
    state: String,
    latitude: Number,
    longitude: Number
  },
  rating: Number
});

module.exports = mongoose.model('Owner', ownerSchema);