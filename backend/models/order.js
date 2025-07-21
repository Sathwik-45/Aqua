const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shopName: String,
  shopOwner: String,
  shopAddress: String,
  customerName: String,
  phoneNumber: String,
  userAddress: String,
  paymentMethod: String,
  paymentStatus: String,
  paymentId: String, // Will be null or empty for COD
  orderItems: {
    waterTins: { type: Number, default: 0 },
    coolingWaterTins: { type: Number, default: 0 },
    waterBottles: { type: Number, default: 0 },
    waterPackers: { type: Number, default: 0 },
  },
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
