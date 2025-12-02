const Trip = require("../models/trip.model");
const BulkTrip = require("../models/bulkTrip.model");
const Ledger = require("../models/ledger.model");
const Agent = require("../models/agent.model");
// TRIP DETAIL REPORT
exports.tripDetail = async (req, res) => {
  try {
    const filter = {};
    if (req.query.agentId) filter.agentId = req.query.agentId;
    if (req.query.dateFrom && req.query.dateTo) {
      filter.createdAt = { $gte: req.query.dateFrom, $lte: req.query.dateTo };
    }

    const trips = await Trip.find(filter).populate("agentId").sort({ createdAt: -1 });

    const report = trips.map((t) => ({
      date: t.createdAt.toISOString().split("T")[0],
      lrNo: t.lrNo,
      agent: t.agentId?.name,
      freight: t.freight,
      advance: t.advance,
      betaCharges: t.betaCharges,
      baseBalance: t.baseBalance,
      totalDeductions: t.totalDeductions,
      finalSettlementPayable: t.finalSettlementPayable,
      isClosed: t.isClosed,
    }));

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// TRIP SUMMARY BY AGENT
exports.tripSummaryByAgent = async (req, res) => {
  try {
    const agents = await Agent.find();
    const report = [];

    for (let agent of agents) {
      const trips = await Trip.find({ agentId: agent._id });

      const totalFreight = trips.reduce((a, b) => a + b.freight, 0);
      const totalAdvance = trips.reduce((a, b) => a + b.advance, 0);
      const totalBeta = trips.reduce((a, b) => a + b.betaCharges, 0);

      report.push({
        agent: agent.name,
        totalFreight,
        totalAdvance,
        totalBeta,
        remainingBalance: agent.remainingBalance,
      });
    }

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
  // BULK TRIP SUMMARY
exports.bulkTripSummary = async (req, res) => {
  try {
    const trips = await BulkTrip.find().populate("agentId").sort({ createdAt: -1 });

    const report = trips.map((t) => ({
      bulkTripCode: t.bulkTripCode,
      agent: t.agentId?.name,
      totalMidPayments: t.totalMidPayments,
      totalCostToCompany: t.totalCostToCompany,
      lrCount: t.lrNos.length,
      lrReceivedStatus: t.lrReceivedStatus,
    }));

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// LEDGER SUMMARY
exports.ledgerSummary = async (req, res) => {
  try {
    const agents = await Agent.find();
    const report = [];

    for (let agent of agents) {
      const ledger = await Ledger.find({ agentId: agent._id });

      const totalCredit = ledger
        .filter((l) => l.direction === "CREDIT")
        .reduce((a, b) => a + b.amount, 0);

      const totalDebit = ledger
        .filter((l) => l.direction === "DEBIT")
        .reduce((a, b) => a + b.amount, 0);

      report.push({
        agent: agent.name,
        openingBalance: agent.openingBalance,
        totalCredit,
        totalDebit,
        remainingBalance: agent.remainingBalance,
      });
    }

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 // CLOSING AUDIT REPORT
exports.closingAudit = async (req, res) => {
  try {
    const ledger = await Ledger.find()
      .populate("agentId")
      .sort({ createdAt: -1 });

    const report = ledger.map((l) => ({
      date: l.createdAt.toISOString().split("T")[0],
      agent: l.agentId?.name,
      lrNo: l.lrNo,
      bulkTripId: l.bulkTripId,
      type: l.type,
      direction: l.direction,
      amount: l.amount,
      description: l.description,
    }));

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
