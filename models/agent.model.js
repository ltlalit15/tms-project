const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true },
    phone: String,
    email: String,
    address: String,
    openingBalance: { type: Number, default: 0 },
    remainingBalance: { type: Number, default: 0 }, // Wallet balance
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
