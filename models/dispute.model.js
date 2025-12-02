const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
  lrNo: { type: String, required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["OPEN", "RESOLVED"], default: "OPEN" },
}, { timestamps: true });

module.exports = mongoose.model("Dispute", disputeSchema);
