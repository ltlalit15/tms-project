const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: String,
    module: String, // TRIP, LEDGER, REPORT, DISPUTE etc
    referenceId: String,
    oldValue: Object,
    newValue: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Audit", auditSchema);
