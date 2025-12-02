  const mongoose = require("mongoose");

  const ledgerSchema = new mongoose.Schema(
    {
      agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
      lrNo: { type: String, default: null },
      bulkTripId: { type: mongoose.Schema.Types.ObjectId, ref: "BulkTrip", default: null },
      type: String, // BETA, MID_PAYMENT, TRIP_DEDUCTION, etc.
      mode: String,
      bank: String,
      direction: { type: String, enum: ["DEBIT", "CREDIT"], required: true },
      amount: { type: Number, required: true },
      description: String,
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Ledger", ledgerSchema);
