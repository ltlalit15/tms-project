const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  date: Date,
});

const chargeSchema = new mongoose.Schema({
  type: String,
  amount: Number,
});

const tripSchema = new mongoose.Schema(
  {
    lrNo: { type: String, unique: true, required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
    tripType: { type: String, enum: ["REGULAR", "BULK"], default: "REGULAR" },

    freight: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
    baseBalance: { type: Number, default: 0 },

    onTripPayments: [paymentSchema],
    charges: [chargeSchema],

    betaCharges: { type: Number, default: 0 },

    totalDeductions: { type: Number, default: 0 },
    finalSettlementPayable: { type: Number, default: 0 },
    excessAmount: { type: Number, default: 0 },

    isClosed: { type: Boolean, default: false },
    closedAt: Date,

    lrReceived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
