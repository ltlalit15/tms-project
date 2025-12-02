const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
    lrNo: String,
    bulkTripId: { type: mongoose.Schema.Types.ObjectId, ref: "BulkTrip", default: null },
    issueType: String,
    description: String,
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "RESOLVED"], default: "OPEN" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", disputeSchema);
