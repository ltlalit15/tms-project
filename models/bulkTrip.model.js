const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  date: Date,
});

const midPaymentSchema = new mongoose.Schema({
  reason: {
    type: String,
    enum: ["BREAKDOWN_REPAIR", "TYRE", "SERVICE", "OTHERS"],
  },
  amount: Number,
  photoUrl: String,
  date: Date,
});

const bulkTripSchema = new mongoose.Schema(
  {
    bulkTripCode: { type: String, required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
    lrNos: [{ type: String }],
    onTripPayments: [paymentSchema],
    midPayments: [midPaymentSchema],
    totalMidPayments: { type: Number, default: 0 },
    totalCostToCompany: { type: Number, default: 0 },
    lrReceivedStatus: { type: String, enum: ["RECEIVED", "NOT_RECEIVED"], default: "NOT_RECEIVED" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BulkTrip", bulkTripSchema);
